import { component$, useContext } from '@builder.io/qwik'
import { firstItemIndex, type StoryData } from '@repo/hn-core'
import { PrefsContext } from '~/lib/prefs'
import { Story } from './story'

interface Props {
  stories: StoryData[]
  label: string
  page?: number
  hideable?: boolean
}

export const StoryList = component$<Props>(({ stories, label, page = 1, hideable = false }) => {
  const prefs = useContext(PrefsContext)
  const visible = hideable ? stories.filter((s) => !prefs.hidden.includes(s.id)) : stories

  if (!visible.length) return <p class="status">Nothing here yet.</p>
  return (
    <ol class="story-list" aria-label={label} start={firstItemIndex(page)}>
      {visible.map((story) => (
        <li key={story.id}>
          <Story story={story} hideable={hideable} />
        </li>
      ))}
    </ol>
  )
})
