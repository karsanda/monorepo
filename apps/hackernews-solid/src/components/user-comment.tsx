import type { UserComment as UserCommentData } from '@repo/hn-core'
import { Show } from 'solid-js'
import { RelTime } from './rel-time'

export function UserComment(props: { comment: UserCommentData }) {
  return (
    <article class="comment">
      <div class="comment-header">
        <a href={`/user/${props.comment.by}`}>
          <strong>{props.comment.by}</strong>
        </a>
        &nbsp;
        <RelTime unix={props.comment.time} />
        <Show when={props.comment.storyId}>
          &nbsp;on&nbsp;
          <a href={`/comments/${props.comment.storyId}`}>{props.comment.storyTitle}</a>
        </Show>
      </div>
      <div class="comment-content" innerHTML={props.comment.text} />
    </article>
  )
}
