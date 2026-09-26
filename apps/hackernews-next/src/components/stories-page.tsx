import { getPage, STORY_TYPE_TITLES, type StoryData, type StoryType } from '@repo/hn-core'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { loadStories } from '@/lib/data'
import { param } from '@/lib/meta'
import { Loading } from './loading'
import { LoadError } from './load-error'
import { Pager } from './pager'
import { StoryList } from './story-list'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function title(type: StoryType, page: number) {
  return STORY_TYPE_TITLES[type] + (page > 1 ? ` (page ${page})` : '')
}

export async function storiesMetadata(type: StoryType, searchParams: SearchParams) {
  const page = getPage(param((await searchParams).page))
  return { title: title(type, page) } satisfies Metadata
}

/** A story list page: the shell renders at once and the 30 stories stream in. */
export async function StoriesPage({
  type,
  searchParams,
}: {
  type: StoryType
  searchParams: SearchParams
}) {
  const page = getPage(param((await searchParams).page))
  const { pageCount, stories } = await loadStories(type, page)

  return (
    <>
      <h1 className="visually-hidden">{title(type, page)}</h1>
      <Suspense key={`${type}:${page}`} fallback={<Loading label="Loading stories" lines={12} />}>
        <Stories stories={stories} page={page} pageCount={pageCount} type={type} />
      </Suspense>
    </>
  )
}

async function Stories({
  stories,
  page,
  pageCount,
  type,
}: {
  stories: Promise<StoryData[]>
  page: number
  pageCount: number
  type: StoryType
}) {
  const items = await stories.catch(() => null)
  if (!items) return <LoadError what="stories" />
  return (
    <>
      <StoryList stories={items} label="Stories" page={page} hideable />
      <Pager page={page} pageCount={pageCount} href={(p) => `/${type}?page=${p}`} />
    </>
  )
}
