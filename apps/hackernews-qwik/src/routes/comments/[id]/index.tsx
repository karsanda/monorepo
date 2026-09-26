import { component$ } from '@builder.io/qwik'
import { Link, routeLoader$, type DocumentHead } from '@builder.io/qwik-city'
import { Comment } from '~/components/comment'
import { LoadError } from '~/components/load-error'
import { NotFound } from '~/components/not-found'
import { RelTime } from '~/components/rel-time'
import { Story } from '~/components/story'
import { loadItem, loadThread } from '~/lib/data'

export const useItem = routeLoader$(async ({ params, status }) => {
  // The item and its whole comment tree (one Algolia request) load in parallel.
  const [item, thread] = await Promise.all([
    loadItem(params.id),
    loadThread(params.id).catch(() => null),
  ])
  if (!item) status(404)
  return item && { item, thread }
})

export default component$(() => {
  const data = useItem().value
  if (!data) return <NotFound />
  const { item, thread } = data

  return (
    <>
      {item.type === 'comment' ? (
        <article class="comment">
          <h1 class="comment-header">
            <Link href={`/user/${item.by}`}>{item.by}</Link>
            &nbsp;
            <RelTime unix={item.time} />
            &nbsp;|&nbsp;<Link href={`/comments/${item.parent}`}>parent</Link>
          </h1>
          <div class="comment-content" dangerouslySetInnerHTML={item.text} />
        </article>
      ) : (
        <Story story={item} heading="h1" showText />
      )}

      <section class="comment-list" aria-label="Comments">
        {!thread ? (
          <LoadError what="comments" />
        ) : thread.length ? (
          thread.map((comment) => <Comment key={comment.id} comment={comment} />)
        ) : (
          <p class="status">No comments yet.</p>
        )}
      </section>
    </>
  )
})

export const head: DocumentHead = ({ resolveValue }) => {
  const item = resolveValue(useItem)?.item
  if (!item) return { title: 'Not found' }
  return { title: item.type === 'comment' ? `Comment by ${item.by}` : item.title }
}
