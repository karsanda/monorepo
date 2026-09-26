export const STORY_TYPES = [
  'topstories',
  'newstories',
  'beststories',
  'askstories',
  'showstories',
  'jobstories',
] as const

export type StoryType = (typeof STORY_TYPES)[number]

export type SubmissionFilter = 'STORIES' | 'COMMENTS'

export interface StoryData {
  by: string
  descendants?: number
  id: number
  kids?: number[]
  score: number
  text?: string
  time: number
  title: string
  type: 'story' | 'job' | 'poll'
  url?: string
  dead?: boolean
  deleted?: boolean
}

export interface CommentData {
  by: string
  id: number
  kids?: number[]
  parent: number
  text: string
  time: number
  type: 'comment'
  dead?: boolean
  deleted?: boolean
}

export interface UserData {
  id: string
  created: number
  karma: number
  about?: string
  submitted?: number[]
}

export function isStoryType(value: string): value is StoryType {
  return (STORY_TYPES as readonly string[]).includes(value)
}

export type ItemData = StoryData | CommentData

/** A comment in a thread loaded in one request (see `HnClient.getThread`). */
export interface ThreadComment {
  id: number
  /** `null` for deleted comments. */
  by: string | null
  /** `null` for deleted comments. */
  text: string | null
  time: number
  parent: number
  kids: ThreadComment[]
}

export interface SearchHit {
  id: number
  title: string
  url?: string
  by: string
  score: number
  comments: number
  time: number
}

export interface SearchResult {
  hits: SearchHit[]
  /** 1-based, like `?page=`. */
  page: number
  pageCount: number
}

/** False for missing, dead and deleted items. */
export function isLive<T extends { dead?: boolean; deleted?: boolean }>(
  item: T | null | undefined,
): item is T {
  return !!item && !item.dead && !item.deleted
}
