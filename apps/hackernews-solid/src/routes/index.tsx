import type { RouteDefinition } from '@solidjs/router'
import { getPage, HOME_STORY_TYPE } from '@repo/hn-core'
import { StoriesPage } from '~/components/stories-page'
import { param } from '~/lib/meta'
import { getStories } from '~/lib/queries'

export const route = {
  preload: ({ location }) => getStories(HOME_STORY_TYPE, getPage(param(location.query.page))),
} satisfies RouteDefinition

export default function Home() {
  return <StoriesPage type={HOME_STORY_TYPE} />
}
