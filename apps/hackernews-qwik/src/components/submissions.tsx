import { $, component$, useStore } from '@builder.io/qwik'
import type { ResultPage, StoryData, UserComment as UserCommentData } from '@repo/hn-core'
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

async function more<T>(feed: Feed<T>, load: (page: number) => Promise<ResultPage<T>>) {
  feed.loading = true
  feed.failed = false
  try {
    const next = await load(feed.page + 1)
    feed.items = [...feed.items, ...next.items]
    feed.page = next.page
    feed.pageCount = next.pageCount
  } catch {
    feed.failed = true
  } finally {
    feed.loading = false
  }
}

interface Props {
  user: string
  /** Server-rendered first page; later pages load in the browser. */
  firstStories: ResultPage<StoryData>
}

export const Submissions = component$<Props>(({ user, firstStories }) => {
  const state = useStore({
    tab: 'Submissions' as Tab,
    stories: { ...firstStories, loading: false, failed: false } as Feed<StoryData>,
    // `page` 0: nothing loaded yet.
    comments: {
      items: [],
      page: 0,
      pageCount: 1,
      loading: false,
      failed: false,
    } as Feed<UserCommentData>,
  })

  const moreStories = $(() => more(state.stories, (page) => hn.getUserStories(user, page)))
  const moreComments = $(() => more(state.comments, (page) => hn.getUserComments(user, page)))

  const show = $((next: Tab) => {
    state.tab = next
    if (next === 'Comments' && state.comments.page === 0 && !state.comments.loading) {
      return moreComments()
    }
  })

  const feed = state.tab === 'Submissions' ? state.stories : state.comments

  return (
    <>
      <div class="tabs">
        {TABS.map((name) => (
          <button
            key={name}
            class="tab-button"
            type="button"
            aria-pressed={state.tab === name}
            onClick$={() => show(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {feed.items.length > 0 ? (
        <ol class="story-list" aria-label={state.tab}>
          {state.tab === 'Submissions'
            ? state.stories.items.map((story) => (
                <li key={story.id}>
                  <Story story={story} />
                </li>
              ))
            : state.comments.items.map((comment) => (
                <li key={comment.id}>
                  <UserComment comment={comment} />
                </li>
              ))}
        </ol>
      ) : (
        !feed.loading && !feed.failed && <p class="status">No {state.tab.toLowerCase()} yet.</p>
      )}

      {feed.failed && (
        <p class="status" role="alert">
          Couldn&apos;t load more {state.tab.toLowerCase()}.
        </p>
      )}

      {feed.loading ? (
        <p class="status" role="status">
          Loading…
        </p>
      ) : (
        feed.page < feed.pageCount && (
          <div class="pager">
            <button
              class="link-button"
              type="button"
              onClick$={() => (state.tab === 'Submissions' ? moreStories() : moreComments())}
            >
              Load more
            </button>
          </div>
        )
      )}
    </>
  )
})
