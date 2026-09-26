import type { StoryData } from '@repo/hn-core'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { story } from '@/test/fixtures'
import { loadItem, loadSearch, loadStories, loadThread, loadUser } from './data'
import { hn } from './hn'

vi.mock('./hn', () => ({
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

beforeEach(() => {
  vi.resetAllMocks()
})

describe('loadStories', () => {
  test('paginates ids and drops dead or deleted stories', async () => {
    mocked.getIds.mockResolvedValue(Array.from({ length: 45 }, (_, i) => i + 1))
    mocked.getItems.mockImplementation(async (ids) =>
      ids.map((id) => (id === 32 ? story(id, { dead: true }) : story(id))),
    )

    const data = await loadStories('newstories', 2)
    expect(mocked.getIds).toHaveBeenCalledWith('newstories')
    expect(data.pageCount).toBe(2)
    expect(mocked.getItems.mock.calls[0]![0]).toHaveLength(15)
    expect((await data.stories).map((s: StoryData) => s.id)).not.toContain(32)
  })

  test('fails when HN is down', async () => {
    mocked.getIds.mockRejectedValue(new Error('offline'))
    await expect(loadStories('topstories', 1)).rejects.toThrow('offline')
  })
})

describe('loadItem', () => {
  test('is null for missing, dead and non-numeric items', async () => {
    mocked.getItem.mockResolvedValueOnce(null)
    expect(await loadItem('1')).toBeNull()
    mocked.getItem.mockResolvedValueOnce(story(1, { dead: true }))
    expect(await loadItem('1')).toBeNull()
    expect(await loadItem('x')).toBeNull()
    expect(mocked.getItem).toHaveBeenCalledTimes(2)
  })

  test('returns live items', async () => {
    mocked.getItem.mockResolvedValue(story(1))
    expect(await loadItem('1')).toEqual(story(1))
  })
})

test('loadThread treats a missing thread as empty', async () => {
  mocked.getThread.mockResolvedValue(null)
  expect(await loadThread('1')).toEqual([])
})

test('loadUser is null when the user does not exist', async () => {
  mocked.getUser.mockResolvedValue(null)
  mocked.getUserStories.mockResolvedValue({ items: [], page: 1, pageCount: 0 })
  expect(await loadUser('x')).toBeNull()
})

test('loadSearch skips empty queries', async () => {
  expect(await loadSearch('', 1)).toBeNull()
  expect(mocked.search).not.toHaveBeenCalled()
})
