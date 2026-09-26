import type { StoryData } from '@repo/hn-core'
import { isHttpError } from '@sveltejs/kit'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { hn } from '$lib/hn'
import { load as storiesLoad } from './[[slug=storytype]]/+page.server'
import { load as commentsLoad } from './comments/[id]/+page.server'
import { load as userLoad } from './user/[id]/+page.server'
import { load as searchLoad } from './search/+page.server'

vi.mock('$lib/hn', () => ({
  hn: {
    getIds: vi.fn(),
    getItems: vi.fn(),
    getItem: vi.fn(),
    getThread: vi.fn(),
    getUser: vi.fn(),
    getUserStories: vi.fn(),
    search: vi.fn(),
  },
}))

const mocked = vi.mocked(hn, true)
// The loads only read `url` and `params`; the rest of the event isn't used.
const event = (url: string, params: Record<string, string | undefined> = {}) =>
  ({ url: new URL(url, 'http://localhost'), params }) as never

async function status(promise: unknown) {
  try {
    await promise
  } catch (e) {
    if (isHttpError(e)) return e.status
    throw e
  }
  return 200
}

const story = (id: number, extra: Partial<StoryData> = {}): StoryData => ({
  id,
  by: 'pg',
  score: 1,
  time: 1,
  title: `Story ${id}`,
  type: 'story',
  ...extra,
})

beforeEach(() => {
  vi.resetAllMocks()
})

describe('story list', () => {
  test('paginates ids and drops dead or deleted stories', async () => {
    mocked.getIds.mockResolvedValue(Array.from({ length: 45 }, (_, i) => i + 1))
    mocked.getItems.mockImplementation(async (ids) =>
      ids.map((id) => (id === 32 ? story(id, { dead: true }) : story(id))),
    )

    const data = (await storiesLoad(event('/newstories?page=2', { slug: 'newstories' })))!
    expect(mocked.getIds).toHaveBeenCalledWith('newstories')
    expect(data).toMatchObject({ type: 'newstories', page: 2, pageCount: 2 })
    expect(mocked.getItems.mock.calls[0]![0]).toHaveLength(15)
    expect((await data.stories).map((s: StoryData) => s.id)).not.toContain(32)
  })

  test('defaults to top stories and fails with 502 when HN is down', async () => {
    mocked.getIds.mockRejectedValue(new Error('offline'))
    expect(await status(storiesLoad(event('/')))).toBe(502)
    expect(mocked.getIds).toHaveBeenCalledWith('topstories')
  })
})

describe('comments', () => {
  test('404s for missing, dead and non-numeric items', async () => {
    mocked.getItem.mockResolvedValueOnce(null)
    expect(await status(commentsLoad(event('/comments/1', { id: '1' })))).toBe(404)
    mocked.getItem.mockResolvedValueOnce(story(1, { dead: true }))
    expect(await status(commentsLoad(event('/comments/1', { id: '1' })))).toBe(404)
    expect(await status(commentsLoad(event('/comments/x', { id: 'x' })))).toBe(404)
  })

  test('streams the thread, treating a missing thread as empty', async () => {
    mocked.getItem.mockResolvedValue(story(1))
    mocked.getThread.mockResolvedValue(null)
    const data = (await commentsLoad(event('/comments/1', { id: '1' })))!
    expect(await data.thread).toEqual([])
  })
})

test('user 404s when the user does not exist', async () => {
  mocked.getUser.mockResolvedValue(null)
  mocked.getUserStories.mockResolvedValue({ items: [], page: 1, pageCount: 0 })
  expect(await status(userLoad(event('/user/x', { id: 'x' })))).toBe(404)
})

test('search skips empty queries', async () => {
  expect(await searchLoad(event('/search?q=%20'))).toEqual({ query: '', results: null })
  expect(mocked.search).not.toHaveBeenCalled()
})
