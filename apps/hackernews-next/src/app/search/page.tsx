import { getPage } from '@repo/hn-core'
import type { Metadata } from 'next'
import { Pager } from '@/components/pager'
import { StoryList } from '@/components/story-list'
import { loadSearch } from '@/lib/data'
import { param } from '@/lib/meta'

async function readParams(searchParams: PageProps<'/search'>['searchParams']) {
  const params = await searchParams
  return { query: param(params.q)?.trim() ?? '', page: getPage(param(params.page)) }
}

export async function generateMetadata({ searchParams }: PageProps<'/search'>): Promise<Metadata> {
  const { query } = await readParams(searchParams)
  return { title: query ? `Search: ${query}` : 'Search' }
}

export default async function SearchPage({ searchParams }: PageProps<'/search'>) {
  const { query, page } = await readParams(searchParams)
  const results = await loadSearch(query, page)
  const href = (p: number) => `/search?${new URLSearchParams({ q: query, page: String(p) })}`

  return (
    <>
      <h1 className="visually-hidden">Search</h1>
      {results ? (
        <>
          <StoryList stories={results.items} label="Search results" page={results.page} />
          <Pager page={results.page} pageCount={results.pageCount} href={href} />
        </>
      ) : (
        <p className="status">Type in the search box to find stories.</p>
      )}
    </>
  )
}
