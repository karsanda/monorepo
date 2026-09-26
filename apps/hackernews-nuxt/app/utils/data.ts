import {
  isLive,
  pageCount,
  paginateData,
  type ItemData,
  type StoryData,
  type StoryType,
} from '@repo/hn-core'
import { hn } from './hn'

/** One page of a story list, without dead or deleted stories. */
export async function loadStories(type: StoryType, page: number) {
  const ids = await hn.getIds(type)
  const items = await hn.getItems<StoryData>(paginateData(ids, page))
  return { pageCount: pageCount(ids.length), stories: items.filter((item) => isLive(item)) }
}

/** A live story, job, poll or comment, or `null` for anything that should 404. */
export async function loadItem(id: string): Promise<ItemData | null> {
  if (!/^\d+$/.test(id)) return null
  const item = await hn.getItem(id)
  return isLive(item) ? item : null
}

/** The whole comment tree in one Algolia request. */
export const loadThread = (id: string) => hn.getThread(id).then((comments) => comments ?? [])

/** A user and the first page of their stories, or `null` if the user doesn't exist. */
export async function loadUser(id: string) {
  const [user, stories] = await Promise.all([hn.getUser(id), hn.getUserStories(id)])
  return user ? { user, stories } : null
}

/** Search results, or `null` when there's nothing to search for. */
export function loadSearch(query: string, page: number) {
  return query ? hn.search(query, page) : Promise.resolve(null)
}
