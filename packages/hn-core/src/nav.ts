import type { StoryType } from './types'

/** Nav bar tabs, in order. Top stories are the home page, so they have no tab. */
export const NAV_TABS: readonly { type: StoryType; label: string }[] = [
  { type: 'newstories', label: 'New' },
  { type: 'beststories', label: 'Best' },
  { type: 'askstories', label: 'Ask' },
  { type: 'showstories', label: 'Show' },
  { type: 'jobstories', label: 'Jobs' },
]

export const STORY_TYPE_TITLES: Record<StoryType, string> = {
  topstories: 'Top stories',
  newstories: 'New stories',
  beststories: 'Best stories',
  askstories: 'Ask HN',
  showstories: 'Show HN',
  jobstories: 'Jobs',
}
