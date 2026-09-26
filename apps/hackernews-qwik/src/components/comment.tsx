import { component$, useSignal } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import type { ThreadComment } from '@repo/hn-core'
import { RelTime } from './rel-time'

export const Comment = component$<{ comment: ThreadComment }>(({ comment }) => {
  const collapsed = useSignal(false)

  // Deleted comments are only worth showing when they have replies.
  if (!comment.by && !comment.kids.length) return null

  return (
    <article class="comment">
      <div class="comment-header">
        <button
          class="collapse-button"
          type="button"
          aria-expanded={!collapsed.value}
          aria-label={`${collapsed.value ? 'Expand' : 'Collapse'} comment by ${comment.by ?? 'deleted user'}`}
          onClick$={() => (collapsed.value = !collapsed.value)}
        >
          <span aria-hidden="true">{collapsed.value ? '▶' : '▼'}</span>
        </button>
        {comment.by ? (
          <Link href={`/user/${comment.by}`} prefetch={false}>
            <strong>{comment.by}</strong>
          </Link>
        ) : (
          '[deleted]'
        )}
        &nbsp;
        <RelTime unix={comment.time} />
      </div>

      {!collapsed.value && (
        <>
          {comment.text && <div class="comment-content" dangerouslySetInnerHTML={comment.text} />}
          {comment.kids.length > 0 && (
            <div class="comment-children">
              {comment.kids.map((kid) => (
                <Comment key={kid.id} comment={kid} />
              ))}
            </div>
          )}
        </>
      )}
    </article>
  )
})
