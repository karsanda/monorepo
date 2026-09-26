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
  type: 'story' | 'job'
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
