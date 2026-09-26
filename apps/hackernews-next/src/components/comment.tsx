import type { ThreadComment } from '@repo/hn-core'
import Link from 'next/link'
import { CommentToggle } from './comment-toggle'
import { Time } from './time'

/** A comment and its replies, rendered on the server; only the collapse toggle is interactive. */
export function Comment({ comment }: { comment: ThreadComment }) {
  // Deleted comments are only worth showing when they have replies.
  if (!comment.by && !comment.kids.length) return null

  return (
    <CommentToggle
      author={comment.by ?? 'deleted user'}
      header={
        <>
          {comment.by ? (
            <Link href={`/user/${comment.by}`} prefetch={false}>
              <strong>{comment.by}</strong>
            </Link>
          ) : (
            '[deleted]'
          )}
          &nbsp;
          <Time unix={comment.time} />
        </>
      }
    >
      {comment.text && (
        <div className="comment-content" dangerouslySetInnerHTML={{ __html: comment.text }} />
      )}
      {comment.kids.length > 0 && (
        <div className="comment-children">
          {comment.kids.map((kid) => (
            <Comment key={kid.id} comment={kid} />
          ))}
        </div>
      )}
    </CommentToggle>
  )
}
