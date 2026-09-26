import { component$ } from '@builder.io/qwik'
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city'
import { getPage } from '@repo/hn-core'
import { Pager } from '~/components/pager'
import { StoryList } from '~/components/story-list'
import { loadSearch } from '~/lib/data'

export const useSearch = routeLoader$(async ({ url, status }) => {
  const query = url.searchParams.get('q')?.trim() ?? ''
  const page = getPage(url.searchParams.get('page'))
  try {
    return { query, failed: false, results: await loadSearch(query, page) }
  } catch {
    status(502)
    return { query, failed: true, results: null }
  }
})

export default component$(() => {
  const { query, failed, results } = useSearch().value

  return (
    <>
      <h1 class="visually-hidden">Search</h1>
      {!query ? (
        <p class="status">Type in the search box to find stories.</p>
      ) : failed || !results ? (
        <p class="status" role="alert">
          Couldn&apos;t reach search.
        </p>
      ) : (
        <>
          <StoryList stories={results.items} label="Search results" page={results.page} />
          <Pager
            page={results.page}
            pageCount={results.pageCount}
            prefix={`/search?${new URLSearchParams({ q: query })}&page=`}
          />
        </>
      )}
    </>
  )
})

export const head: DocumentHead = ({ resolveValue }) => {
  const { query } = resolveValue(useSearch)
  return { title: query ? `Search: ${query}` : 'Search' }
}
