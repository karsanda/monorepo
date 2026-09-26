import { getPage, isStoryType } from '@repo/hn-core'
import { useParams, type RouteDefinition } from '@solidjs/router'
import { Show } from 'solid-js'
import { NotFound } from '~/components/not-found'
import { StoriesPage } from '~/components/stories-page'
import { param } from '~/lib/meta'
import { getStories } from '~/lib/queries'

export const route = {
  preload: ({ params, location }) => {
    if (isStoryType(params.type!)) getStories(params.type, getPage(param(location.query.page)))
  },
} satisfies RouteDefinition

export default function StoryTypePage() {
  const params = useParams<{ type: string }>()
  const type = () => (isStoryType(params.type) ? params.type : undefined)

  return (
    <Show when={type()} keyed fallback={<NotFound />}>
      {(type) => <StoriesPage type={type} />}
    </Show>
  )
}
