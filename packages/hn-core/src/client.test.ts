import { describe, expect, test, vi } from 'vitest'
import { createHnClient, createLimiter, HnError } from './client'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

describe('createLimiter', () => {
  test('never runs more than `max` tasks at once', async () => {
    const limit = createLimiter(2)
    let active = 0
    let peak = 0
    const task = () =>
      limit(async () => {
        peak = Math.max(peak, ++active)
        await new Promise((r) => setTimeout(r, 5))
        active--
      })
    await Promise.all(Array.from({ length: 10 }, task))
    expect(peak).toBe(2)
  })
})

describe('createHnClient', () => {
  test('fetches REST items and ids', async () => {
    const fetch = vi.fn(async (url: string | URL | Request) =>
      String(url).endsWith('/topstories.json') ? json([1, 2]) : json({ id: 1, type: 'story' }),
    )
    const hn = createHnClient({ fetch })
    expect(await hn.getIds('topstories')).toEqual([1, 2])
    expect(await hn.getItem(1)).toEqual({ id: 1, type: 'story' })
    expect(fetch).toHaveBeenCalledWith('https://hacker-news.firebaseio.com/v0/item/1.json')
  })

  test('resolves null for missing items (REST returns null, Algolia returns 404)', async () => {
    const hn = createHnClient({
      fetch: async (url: string | URL | Request) =>
        String(url).includes('algolia') ? json({}, 404) : json(null),
    })
    expect(await hn.getItem(1)).toBeNull()
    expect(await hn.getUser('nobody')).toBeNull()
    expect(await hn.getThread(1)).toBeNull()
  })

  test('throws HnError on network errors and error statuses', async () => {
    const offline = createHnClient({
      fetch: async () => {
        throw new TypeError('fetch failed')
      },
    })
    await expect(offline.getItem(1)).rejects.toBeInstanceOf(HnError)

    const broken = createHnClient({ fetch: async () => json({}, 500) })
    await expect(broken.getItem(1)).rejects.toMatchObject({ name: 'HnError', status: 500 })
  })

  test('shares in-flight and cached requests, but retries failures', async () => {
    let calls = 0
    const fetch = vi.fn(async () => (++calls === 1 ? json({}, 500) : json({ id: 1 })))
    const hn = createHnClient({ fetch })
    await expect(hn.getItem(1)).rejects.toThrow()
    const [a, b] = await Promise.all([hn.getItem(1), hn.getItem(1)])
    expect(a).toBe(b)
    await hn.getItem(1)
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  test('refetches after the ttl expires', async () => {
    vi.useFakeTimers()
    try {
      const fetch = vi.fn(async () => json({ id: 1 }))
      const hn = createHnClient({ fetch, ttl: 1000 })
      await hn.getItem(1)
      vi.advanceTimersByTime(1001)
      await hn.getItem(1)
      expect(fetch).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })

  test('an aborted caller rejects without breaking the shared request', async () => {
    const hn = createHnClient({ fetch: async () => json({ id: 1 }) })
    const controller = new AbortController()
    const aborted = hn.getItem(1, { signal: controller.signal })
    controller.abort()
    await expect(aborted).rejects.toBeDefined()
    expect(await hn.getItem(1)).toEqual({ id: 1 })
  })

  test('getThread normalizes the Algolia tree', async () => {
    const hn = createHnClient({
      fetch: async () =>
        json({
          id: 1,
          author: 'pg',
          text: null,
          created_at_i: 100,
          parent_id: null,
          children: [
            {
              id: 15,
              author: 'sama',
              text: 'hi',
              created_at_i: 200,
              parent_id: 1,
              children: [
                {
                  id: 17,
                  author: null,
                  text: null,
                  created_at_i: 300,
                  parent_id: 15,
                  children: [],
                },
              ],
            },
          ],
        }),
    })
    expect(await hn.getThread(1)).toEqual([
      {
        id: 15,
        by: 'sama',
        text: 'hi',
        time: 200,
        parent: 1,
        kids: [{ id: 17, by: null, text: null, time: 300, parent: 15, kids: [] }],
      },
    ])
  })

  test('search maps hits to stories and uses 1-based pages', async () => {
    const fetch = vi.fn(async (_url: string | URL | Request) =>
      json({
        page: 1,
        nbPages: 5,
        hits: [
          {
            objectID: '42',
            title: 'SvelteKit 1.0',
            url: null,
            author: 'x',
            points: 9,
            num_comments: 3,
            created_at_i: 1,
          },
        ],
      }),
    )
    const hn = createHnClient({ fetch })
    expect(await hn.search('svelte', 2)).toEqual({
      page: 2,
      pageCount: 5,
      items: [
        {
          id: 42,
          type: 'story',
          title: 'SvelteKit 1.0',
          url: undefined,
          by: 'x',
          score: 9,
          descendants: 3,
          time: 1,
        },
      ],
    })
    const url = String(fetch.mock.calls[0]![0])
    expect(url).toContain('/search?')
    expect(url).toContain('page=1')
  })

  test("getUserComments lists a user's comments with their stories, newest first", async () => {
    const fetch = vi.fn(async (_url: string | URL | Request) =>
      json({
        page: 0,
        nbPages: 1,
        hits: [
          {
            objectID: '7',
            author: 'pg',
            comment_text: 'hi',
            created_at_i: 5,
            story_id: 3,
            story_title: 'A story',
          },
        ],
      }),
    )
    const hn = createHnClient({ fetch })
    expect((await hn.getUserComments('pg')).items).toEqual([
      { id: 7, by: 'pg', text: 'hi', time: 5, storyId: 3, storyTitle: 'A story' },
    ])
    const url = decodeURIComponent(String(fetch.mock.calls[0]![0]))
    expect(url).toContain('/search_by_date?')
    expect(url).toContain('tags=comment,author_pg')
  })
})
