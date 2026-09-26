import { firstItemIndex, type StoryData } from '@repo/hn-core'
import { For, Show } from 'solid-js'
import { hidden } from '~/lib/prefs'
import { Story } from './story'

interface Props {
  stories: StoryData[]
  label: string
  page?: number
  hideable?: boolean
}

export function StoryList(props: Props) {
  const visible = () =>
    props.hideable ? props.stories.filter((s) => !hidden.has(s.id)) : props.stories

  return (
    <Show when={visible().length} fallback={<p class="status">Nothing here yet.</p>}>
      <ol class="story-list" aria-label={props.label} start={firstItemIndex(props.page ?? 1)}>
        <For each={visible()}>
          {(story) => (
            <li>
              <Story story={story} hideable={props.hideable} />
            </li>
          )}
        </For>
      </ol>
    </Show>
  )
}
