import { getPage, STORY_TYPE_TITLES, type StoryType } from '@repo/hn-core'
import { Title } from '@solidjs/meta'
import { createAsync, revalidate, useSearchParams } from '@solidjs/router'
import { ErrorBoundary, Show, Suspense } from 'solid-js'
import { pageTitle, param } from '~/lib/meta'
import { getStories } from '~/lib/queries'
import { LoadError } from './load-error'
import { Loading } from './loading'
import { Pager } from './pager'
import { StoryList } from './story-list'

/** A story list page: the shell renders at once and the 30 stories stream in. */
export function StoriesPage(props: { type: StoryType }) {
  const [searchParams] = useSearchParams()
  const page = () => getPage(param(searchParams.page))
  const data = createAsync(() => getStories(props.type, page()))
  const title = () => STORY_TYPE_TITLES[props.type] + (page() > 1 ? ` (page ${page()})` : '')

  return (
    <>
      <Title>{pageTitle(title())}</Title>
      <h1 class="visually-hidden">{title()}</h1>
      <ErrorBoundary
        fallback={(_, reset) => (
          <LoadError
            what="stories"
            retry={() => revalidate(getStories.keyFor(props.type, page())).then(reset)}
          />
        )}
      >
        <Suspense fallback={<Loading label="Loading stories" lines={12} />}>
          <Show when={data()}>
            {(data) => (
              <>
                <StoryList stories={data().stories} label="Stories" page={page()} hideable />
                <Pager
                  page={page()}
                  pageCount={data().pageCount}
                  href={(p) => `/${props.type}?page=${p}`}
                />
              </>
            )}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
