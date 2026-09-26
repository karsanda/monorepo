import { itemURI, restURL, typeURI, userURI } from './api'
import { PAGE_SIZE } from './pagination'
import type { ItemData, SearchHit, SearchResult, StoryType, ThreadComment, UserData } from './types'

export const ALGOLIA_API_BASE = 'https://hn.algolia.com/api/v1'

/** A request failed: a network error or a non-404 error status. 404s resolve to `null`. */
export class HnError extends Error {
  readonly url: string
  readonly status?: number

  constructor(url: string, status?: number, options?: ErrorOptions) {
    super(
      status ? `HN request failed with ${status}: ${url}` : `HN request failed: ${url}`,
      options,
    )
    this.name = 'HnError'
    this.url = url
    this.status = status
  }
}

export interface HnClientOptions {
  fetch?: typeof fetch
  /** Most requests in flight at once. A user's page can fan out into thousands of items. */
  concurrency?: number
  /** How long a response is reused, in ms. 0 still shares requests that are in flight. */
  ttl?: number
}

export interface RequestOptions {
  /** Stops waiting for the response. The shared request itself keeps running. */
  signal?: AbortSignal
}

export type HnClient = ReturnType<typeof createHnClient>

interface AlgoliaItem {
  id: number
  author: string | null
  text: string | null
  created_at_i: number
  parent_id: number | null
  children: AlgoliaItem[]
}

interface AlgoliaHit {
  objectID: string
  title: string | null
  url: string | null
  author: string
  points: number | null
  num_comments: number | null
  created_at_i: number
}

interface AlgoliaSearch {
  hits: AlgoliaHit[]
  page: number
  nbPages: number
}

export function createLimiter(max: number) {
  let active = 0
  const queue: (() => void)[] = []

  return async function limit<T>(task: () => Promise<T>): Promise<T> {
    if (active >= max) await new Promise<void>((resolve) => queue.push(resolve))
    active++
    try {
      return await task()
    } finally {
      active--
      queue.shift()?.()
    }
  }
}

function withSignal<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise
  if (signal.aborted) return Promise.reject(signal.reason)
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(signal.reason)
    signal.addEventListener('abort', onAbort, { once: true })
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort))
  })
}

function toThreadComment(item: AlgoliaItem): ThreadComment {
  return {
    id: item.id,
    by: item.author,
    text: item.text,
    time: item.created_at_i,
    parent: item.parent_id ?? 0,
    kids: item.children.map(toThreadComment),
  }
}

function toSearchHit(hit: AlgoliaHit): SearchHit {
  return {
    id: Number(hit.objectID),
    title: hit.title ?? '',
    url: hit.url ?? undefined,
    by: hit.author,
    score: hit.points ?? 0,
    comments: hit.num_comments ?? 0,
    time: hit.created_at_i,
  }
}

/**
 * Fetch-based client for the HN REST API and Algolia. Runs on servers, at the edge and in
 * browsers. Missing items resolve to `null`; failed requests throw `HnError`.
 */
export function createHnClient({
  fetch: fetchFn = (...args) => globalThis.fetch(...args),
  concurrency = 16,
  ttl = 60_000,
}: HnClientOptions = {}) {
  const limit = createLimiter(concurrency)
  const cache = new Map<string, { expires: number; response: Promise<unknown> }>()

  function getJSON<T>(url: string, { signal }: RequestOptions = {}): Promise<T | null> {
    const hit = cache.get(url)
    if (hit && hit.expires > Date.now())
      return withSignal(hit.response as Promise<T | null>, signal)

    const response = limit(async () => {
      let res: Response
      try {
        res = await fetchFn(url)
      } catch (cause) {
        throw new HnError(url, undefined, { cause })
      }
      if (res.status === 404) return null
      if (!res.ok) throw new HnError(url, res.status)
      return (await res.json()) as T | null
    })
    // Keep the entry while in flight; the expiry clock starts once it settles.
    const entry = { expires: Infinity, response }
    cache.set(url, entry)
    response.then(
      () => (entry.expires = Date.now() + ttl),
      () => cache.get(url) === entry && cache.delete(url),
    )
    return withSignal(response, signal)
  }

  const rest = <T>(path: string, options?: RequestOptions) => getJSON<T>(restURL(path), options)

  return {
    getJSON,

    async getIds(type: StoryType, options?: RequestOptions): Promise<number[]> {
      return (await rest<number[]>(typeURI(type), options)) ?? []
    },

    getItem<T extends ItemData = ItemData>(id: number | string, options?: RequestOptions) {
      return rest<T>(itemURI(id), options)
    },

    getItems<T extends ItemData = ItemData>(ids: readonly number[], options?: RequestOptions) {
      return Promise.all(ids.map((id) => rest<T>(itemURI(id), options)))
    },

    getUser(id: string, options?: RequestOptions) {
      return rest<UserData>(userURI(id), options)
    },

    /** An item's whole comment tree in one Algolia request, or `null` if it doesn't exist. */
    async getThread(id: number | string, options?: RequestOptions) {
      const item = await getJSON<AlgoliaItem>(`${ALGOLIA_API_BASE}/items/${id}`, options)
      return item ? item.children.map(toThreadComment) : null
    },

    /** Stories matching `query`, most relevant first. `page` is 1-based. */
    async search(query: string, page = 1, options?: RequestOptions): Promise<SearchResult> {
      const params = new URLSearchParams({
        query,
        tags: 'story',
        page: String(page - 1),
        hitsPerPage: String(PAGE_SIZE),
      })
      const res = await getJSON<AlgoliaSearch>(`${ALGOLIA_API_BASE}/search?${params}`, options)
      return {
        hits: res?.hits.map(toSearchHit) ?? [],
        page,
        pageCount: res?.nbPages ?? 0,
      }
    },
  }
}
