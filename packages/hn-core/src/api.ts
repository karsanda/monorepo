import type { StoryType } from './types'

export const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0'

type Id = string | number

/** Paths relative to the `/v0` ref, used with the Firebase SDK. */
export const itemURI = (id: Id) => `/item/${id}`
export const typeURI = (type: StoryType) => `/${type}`
export const userURI = (id: Id) => `/user/${id}`

/** Full REST URL for a path returned by the helpers above. */
export const restURL = (path: string) => `${HN_API_BASE}${path}.json`
