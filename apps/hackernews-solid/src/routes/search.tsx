import { getPage } from '@repo/hn-core'
import { Title } from '@solidjs/meta'
import { createAsync, useSearchParams } from '@solidjs/router'
import { ErrorBoundary, Show, Suspense } from 'solid-js'
import { Loading } from '~/components/loading'
import { Pager } from '~/components/pager'
import { StoryList } from '~/components/story-list'
import { pageTitle, param } from '~/lib/meta'
import { getSearch } from '~/lib/queries'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = () => param(searchParams.q)?.trim() ?? ''
  const page = () => getPage(param(searchParams.page))
  const results = createAsync(() => getSearch(query(), page()))
  const href = (p: number) => `/search?${new URLSearchParams({ q: query(), page: String(p) })}`

  return (
    <>
      <Title>{pageTitle(query() ? `Search: ${query()}` : 'Search')}</Title>
      <h1 class="visually-hidden">Search</h1>
      <Show when={query()} fallback={<p class="status">Type in the search box to find stories.</p>}>
        <ErrorBoundary
          fallback={
            <p class="status" role="alert">
              Couldn't reach search.
            </p>
          }
        >
          <Suspense fallback={<Loading label="Searching" />}>
            <Show when={results()}>
              {(results) => (
                <>
                  <StoryList
                    stories={results().items}
                    label="Search results"
                    page={results().page}
                  />
                  <Pager page={results().page} pageCount={results().pageCount} href={href} />
                </>
              )}
            </Show>
          </Suspense>
        </ErrorBoundary>
      </Show>
    </>
  )
}
