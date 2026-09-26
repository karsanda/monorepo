import type { StoryType } from './types'

/** The story list every app shows at `/`. It's also served at its own URL (`/beststories`). */
export const HOME_STORY_TYPE: StoryType = 'beststories'

const TABS: readonly { type: StoryType; label: string }[] = [
  { type: 'topstories', label: 'Top' },
  { type: 'newstories', label: 'New' },
  { type: 'beststories', label: 'Best' },
  { type: 'askstories', label: 'Ask' },
  { type: 'showstories', label: 'Show' },
  { type: 'jobstories', label: 'Jobs' },
]

/** Nav bar tabs, in order. The home page's list is the brand link, so it has no tab. */
export const NAV_TABS = TABS.filter((tab) => tab.type !== HOME_STORY_TYPE)

export const STORY_TYPE_TITLES: Record<StoryType, string> = {
  topstories: 'Top stories',
  newstories: 'New stories',
  beststories: 'Best stories',
  askstories: 'Ask HN',
  showstories: 'Show HN',
  jobstories: 'Jobs',
}
