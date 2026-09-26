import type { StoryType } from '@repo/hn-core'
import { query } from '@solidjs/router'
import { loadItem, loadSearch, loadStories, loadThread, loadUser } from './data'

// Router queries: deduplicated between route preloads and components, and serialized from the
// server render to the browser so hydration doesn't fetch again.
export const getStories = query(
  (type: StoryType, page: number) => loadStories(type, page),
  'stories',
)
export const getItem = query((id: string) => loadItem(id), 'item')
export const getThread = query((id: string) => loadThread(id), 'thread')
export const getUser = query((id: string) => loadUser(id), 'user')
export const getSearch = query((q: string, page: number) => loadSearch(q, page), 'search')
