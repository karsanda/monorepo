'use client'

import { firstItemIndex, type StoryData } from '@repo/hn-core'
import { hidden, useIds } from '@/lib/prefs'
import { Story } from './story'

interface Props {
  stories: StoryData[]
  label: string
  page?: number
  hideable?: boolean
}

export function StoryList({ stories, label, page = 1, hideable = false }: Props) {
  const hiddenIds = useIds(hidden)
  const visible = hideable ? stories.filter((s) => !hiddenIds.has(s.id)) : stories

  if (!visible.length) return <p className="status">Nothing here yet.</p>
  return (
    <ol className="story-list" aria-label={label} start={firstItemIndex(page)}>
      {visible.map((story) => (
        <li key={story.id}>
          <Story story={story} hideable={hideable} />
        </li>
      ))}
    </ol>
  )
}
