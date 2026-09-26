import type { ResultPage, StoryData, UserComment as UserCommentData } from '@repo/hn-core'
import { createSignal, For, Match, Show, Switch } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { hn } from '~/lib/hn'
import { Story } from './story'
import { UserComment } from './user-comment'

type Tab = 'Submissions' | 'Comments'

interface Feed<T> {
  items: T[]
  page: number
  pageCount: number
  loading: boolean
  failed: boolean
}

const TABS: readonly Tab[] = ['Submissions', 'Comments']

/** A feed that loads its next page on demand. `page` 0 means nothing has loaded yet. */
function createFeed<T>(load: (page: number) => Promise<ResultPage<T>>, first?: ResultPage<T>) {
  const [feed, setFeed] = createStore<Feed<T>>({
    ...(first ?? { items: [], page: 0, pageCount: 1 }),
    loading: false,
    failed: false,
  })

  async function more() {
    setFeed({ loading: true, failed: false })
    try {
      const next = await load(feed.page + 1)
      setFeed(
        produce((f) => {
          f.items.push(...next.items)
          f.page = next.page
          f.pageCount = next.pageCount
        }),
      )
    } catch {
      setFeed('failed', true)
    } finally {
      setFeed('loading', false)
    }
  }

  return [feed, more] as const
}

interface Props {
  user: string
  /** Server-rendered first page; later pages load in the browser. */
  firstStories: ResultPage<StoryData>
}

export function Submissions(props: Props) {
  const [tab, setTab] = createSignal<Tab>('Submissions')
  const [stories, moreStories] = createFeed(
    (page) => hn.getUserStories(props.user, page),
    // Only the initial value; later pages are loaded here, not passed in.
    // eslint-disable-next-line solid/reactivity
    props.firstStories,
  )
  const [comments, moreComments] = createFeed<UserCommentData>((page) =>
    hn.getUserComments(props.user, page),
  )

  function show(next: Tab) {
    setTab(next)
    if (next === 'Comments' && comments.page === 0 && !comments.loading) moreComments()
  }

  const feed = () => (tab() === 'Submissions' ? stories : comments)

  return (
    <>
      <div class="tabs">
        <For each={TABS}>
          {(name) => (
            <button
              class="tab-button"
              type="button"
              aria-pressed={tab() === name}
              onClick={() => show(name)}
            >
              {name}
            </button>
          )}
        </For>
      </div>

      <Switch>
        <Match when={feed().items.length}>
          <ol class="story-list" aria-label={tab()}>
            <Show
              when={tab() === 'Submissions'}
              fallback={
                <For each={comments.items}>
                  {(comment) => (
                    <li>
                      <UserComment comment={comment} />
                    </li>
                  )}
                </For>
              }
            >
              <For each={stories.items}>
                {(story) => (
                  <li>
                    <Story story={story} />
                  </li>
                )}
              </For>
            </Show>
          </ol>
        </Match>
        <Match when={!feed().loading && !feed().failed}>
          <p class="status">No {tab().toLowerCase()} yet.</p>
        </Match>
      </Switch>

      <Show when={feed().failed}>
        <p class="status" role="alert">
          Couldn't load more {tab().toLowerCase()}.
        </p>
      </Show>

      <Show
        when={!feed().loading}
        fallback={
          <p class="status" role="status">
            Loading…
          </p>
        }
      >
        <Show when={feed().page < feed().pageCount}>
          <div class="pager">
            <button
              class="link-button"
              type="button"
              onClick={() => (tab() === 'Submissions' ? moreStories() : moreComments())}
            >
              Load more
            </button>
          </div>
        </Show>
      </Show>
    </>
  )
}
