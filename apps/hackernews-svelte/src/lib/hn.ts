import { itemURI, restURL } from '@repo/hn-core'

type Fetch = typeof fetch

// A user's comment tab can fan out into thousands of item requests (each comment walks
// its parent chain); cap how many are in flight so the browser doesn't reject them.
const MAX_IN_FLIGHT = 16
let inFlight = 0
const queue: (() => void)[] = []

async function limited<T>(task: () => Promise<T>): Promise<T> {
  if (inFlight >= MAX_IN_FLIGHT) await new Promise<void>((resolve) => queue.push(resolve))
  inFlight++
  try {
    return await task()
  } finally {
    inFlight--
    queue.shift()?.()
  }
}

export function getJSON<T>(fetch: Fetch, path: string): Promise<T | null> {
  return limited(async () => {
    const res = await fetch(restURL(path))
    return res.ok ? ((await res.json()) as T | null) : null
  })
}

export const getItem = <T>(fetch: Fetch, id: number | string) => getJSON<T>(fetch, itemURI(id))
