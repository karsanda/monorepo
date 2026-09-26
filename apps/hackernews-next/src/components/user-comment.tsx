import type { UserComment as UserCommentData } from '@repo/hn-core'
import Link from 'next/link'
import { Time } from './time'

export function UserComment({ comment }: { comment: UserCommentData }) {
  return (
    <article className="comment">
      <div className="comment-header">
        <Link href={`/user/${comment.by}`} prefetch={false}>
          <strong>{comment.by}</strong>
        </Link>
        &nbsp;
        <Time unix={comment.time} />
        {comment.storyId > 0 && (
          <>
            &nbsp;on&nbsp;
            <Link href={`/comments/${comment.storyId}`} prefetch={false}>
              {comment.storyTitle}
            </Link>
          </>
        )}
      </div>
      <div className="comment-content" dangerouslySetInnerHTML={{ __html: comment.text }} />
    </article>
  )
}
