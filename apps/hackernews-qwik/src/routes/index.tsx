import { component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'
import { HOME_STORY_TYPE } from '@repo/hn-core'
import { StoriesPage, storiesLoader, storiesTitle } from '~/components/stories-page'

export const useStories = routeLoader$((event) => storiesLoader(HOME_STORY_TYPE, event))

export default component$(() => {
  const stories = useStories()
  return <StoriesPage data={stories.value} />
})

export const head: DocumentHead = ({ resolveValue }) => ({
  title: storiesTitle(resolveValue(useStories)),
})
