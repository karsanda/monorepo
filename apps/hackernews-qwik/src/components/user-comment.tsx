import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import type { UserComment as UserCommentData } from '@repo/hn-core'
import { RelTime } from './rel-time'

export const UserComment = component$<{ comment: UserCommentData }>(({ comment }) => (
  <article class="comment">
    <div class="comment-header">
      <Link href={`/user/${comment.by}`} prefetch={false}>
        <strong>{comment.by}</strong>
      </Link>
      &nbsp;
      <RelTime unix={comment.time} />
      {comment.storyId > 0 && (
        <>
          &nbsp;on&nbsp;
          <Link href={`/comments/${comment.storyId}`} prefetch={false}>
            {comment.storyTitle}
          </Link>
        </>
      )}
    </div>
    <div class="comment-content" dangerouslySetInnerHTML={comment.text} />
  </article>
))
