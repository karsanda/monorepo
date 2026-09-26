import { component$ } from '@builder.io/qwik'
import type { RequestEventLoader } from '@builder.io/qwik-city'
import {
  getPage,
  isStoryType,
  STORY_TYPE_TITLES,
  type StoryData,
  type StoryType,
} from '@repo/hn-core'
import { loadStories } from '~/lib/data'
import { LoadError } from './load-error'
import { NotFound } from './not-found'
import { Pager } from './pager'
import { StoryList } from './story-list'

export type StoriesData =
  | null
  | { type: StoryType; page: number; failed: true }
  | { type: StoryType; page: number; failed: false; pageCount: number; stories: StoryData[] }

/** Loads a story list page for a route loader; `null` (with a 404) for unknown types. */
export async function storiesLoader(type: string, { url, status }: RequestEventLoader) {
  if (!isStoryType(type)) {
    status(404)
    return null
  }
  const page = getPage(url.searchParams.get('page'))
  try {
    return { type, page, failed: false as const, ...(await loadStories(type, page)) }
  } catch {
    status(502)
    return { type, page, failed: true as const }
  }
}

export const storiesTitle = (data: StoriesData) =>
  data ? STORY_TYPE_TITLES[data.type] + (data.page > 1 ? ` (page ${data.page})` : '') : 'Not found'

export const StoriesPage = component$<{ data: StoriesData }>(({ data }) => {
  if (!data) return <NotFound />
  return (
    <>
      <h1 class="visually-hidden">{storiesTitle(data)}</h1>
      {data.failed ? (
        <LoadError what="stories" />
      ) : (
        <>
          <StoryList stories={data.stories} label="Stories" page={data.page} hideable />
          <Pager page={data.page} pageCount={data.pageCount} prefix={`/${data.type}?page=`} />
        </>
      )}
    </>
  )
})
