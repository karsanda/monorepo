'use client'

import type { ResultPage, StoryData, UserComment as UserCommentData } from '@repo/hn-core'
import { useState } from 'react'
import { hn } from '@/lib/hn'
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
function useFeed<T>(load: (page: number) => Promise<ResultPage<T>>, first?: ResultPage<T>) {
  const [feed, setFeed] = useState<Feed<T>>(() => ({
    ...(first ?? { items: [], page: 0, pageCount: 1 }),
    loading: false,
    failed: false,
  }))

  async function more() {
    setFeed((f) => ({ ...f, loading: true, failed: false }))
    try {
      const next = await load(feed.page + 1)
      setFeed((f) => ({
        items: [...f.items, ...next.items],
        page: next.page,
        pageCount: next.pageCount,
        loading: false,
        failed: false,
      }))
    } catch {
      setFeed((f) => ({ ...f, loading: false, failed: true }))
    }
  }

  return [feed, more] as const
}

interface Props {
  user: string
  /** Server-rendered first page; later pages load in the browser. */
  firstStories: ResultPage<StoryData>
}

export function Submissions({ user, firstStories }: Props) {
  const [tab, setTab] = useState<Tab>('Submissions')
  const [stories, moreStories] = useFeed((page) => hn.getUserStories(user, page), firstStories)
  const [comments, moreComments] = useFeed<UserCommentData>((page) =>
    hn.getUserComments(user, page),
  )

  function show(next: Tab) {
    setTab(next)
    if (next === 'Comments' && comments.page === 0 && !comments.loading) moreComments()
  }

  const feed = tab === 'Submissions' ? stories : comments

  return (
    <>
      <div className="tabs">
        {TABS.map((name) => (
          <button
            key={name}
            className="tab-button"
            type="button"
            aria-pressed={tab === name}
            onClick={() => show(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {feed.items.length > 0 ? (
        <ol className="story-list" aria-label={tab}>
          {tab === 'Submissions'
            ? stories.items.map((story) => (
                <li key={story.id}>
                  <Story story={story} />
                </li>
              ))
            : comments.items.map((comment) => (
                <li key={comment.id}>
                  <UserComment comment={comment} />
                </li>
              ))}
        </ol>
      ) : (
        !feed.loading && !feed.failed && <p className="status">No {tab.toLowerCase()} yet.</p>
      )}

      {feed.failed && (
        <p className="status" role="alert">
          Couldn&apos;t load more {tab.toLowerCase()}.
        </p>
      )}

      {feed.loading ? (
        <p className="status" role="status">
          Loading…
        </p>
      ) : (
        feed.page < feed.pageCount && (
          <div className="pager">
            <button
              className="link-button"
              type="button"
              onClick={tab === 'Submissions' ? moreStories : moreComments}
            >
              Load more
            </button>
          </div>
        )
      )}
    </>
  )
}
