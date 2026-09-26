import type { CommentData, StoryData } from '@repo/hn-core'
import { Title } from '@solidjs/meta'
import { createAsync, revalidate, useParams, type RouteDefinition } from '@solidjs/router'
import { ErrorBoundary, For, Show, Suspense } from 'solid-js'
import { Comment } from '~/components/comment'
import { LoadError } from '~/components/load-error'
import { Loading } from '~/components/loading'
import { NotFound } from '~/components/not-found'
import { RelTime } from '~/components/rel-time'
import { Story } from '~/components/story'
import { pageTitle } from '~/lib/meta'
import { getItem, getThread } from '~/lib/queries'

export const route = {
  preload: ({ params }) => {
    getItem(params.id!)
    getThread(params.id!)
  },
} satisfies RouteDefinition

export default function CommentsPage() {
  const params = useParams<{ id: string }>()
  // Held back from streaming until it resolves, so a missing item can still answer 404.
  const item = createAsync(() => getItem(params.id), { deferStream: true })
  const thread = createAsync(() => getThread(params.id))

  return (
    <Show when={item() !== undefined}>
      <Show when={item()} fallback={<NotFound />}>
        {(item) => (
          <>
            <Show when={item().type === 'comment' ? (item() as CommentData) : undefined}>
              {(comment) => (
                <>
                  <Title>{pageTitle(`Comment by ${comment().by}`)}</Title>
                  <article class="comment">
                    <h1 class="comment-header">
                      <a href={`/user/${comment().by}`}>{comment().by}</a>
                      &nbsp;
                      <RelTime unix={comment().time} />
                      &nbsp;|&nbsp;<a href={`/comments/${comment().parent}`}>parent</a>
                    </h1>
                    <div class="comment-content" innerHTML={comment().text} />
                  </article>
                </>
              )}
            </Show>
            <Show when={item().type !== 'comment' ? (item() as StoryData) : undefined}>
              {(story) => (
                <>
                  <Title>{pageTitle(story().title)}</Title>
                  <Story story={story()} heading="h1" showText />
                </>
              )}
            </Show>

            <section class="comment-list" aria-label="Comments">
              <ErrorBoundary
                fallback={(_, reset) => (
                  <LoadError
                    what="comments"
                    retry={() => revalidate(getThread.keyFor(params.id)).then(reset)}
                  />
                )}
              >
                <Suspense fallback={<Loading label="Loading comments" />}>
                  <For each={thread()} fallback={<p class="status">No comments yet.</p>}>
                    {(comment) => <Comment comment={comment} />}
                  </For>
                </Suspense>
              </ErrorBoundary>
            </section>
          </>
        )}
      </Show>
    </Show>
  )
}
