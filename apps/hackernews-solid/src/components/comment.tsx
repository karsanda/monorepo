import type { ThreadComment } from '@repo/hn-core'
import { createSignal, For, Show } from 'solid-js'
import { RelTime } from './rel-time'

export function Comment(props: { comment: ThreadComment }) {
  const [collapsed, setCollapsed] = createSignal(false)

  return (
    // Deleted comments are only worth showing when they have replies.
    <Show when={props.comment.by || props.comment.kids.length}>
      <article class="comment">
        <div class="comment-header">
          <button
            class="collapse-button"
            type="button"
            aria-expanded={!collapsed()}
            aria-label={`${collapsed() ? 'Expand' : 'Collapse'} comment by ${props.comment.by ?? 'deleted user'}`}
            onClick={() => setCollapsed(!collapsed())}
          >
            <span aria-hidden="true">{collapsed() ? '▶' : '▼'}</span>
          </button>
          <Show when={props.comment.by} fallback="[deleted]">
            {(by) => (
              <a href={`/user/${by()}`}>
                <strong>{by()}</strong>
              </a>
            )}
          </Show>
          &nbsp;
          <RelTime unix={props.comment.time} />
        </div>

        <Show when={!collapsed()}>
          <Show when={props.comment.text}>
            {(text) => <div class="comment-content" innerHTML={text()} />}
          </Show>
          <Show when={props.comment.kids.length}>
            <div class="comment-children">
              <For each={props.comment.kids}>{(kid) => <Comment comment={kid} />}</For>
            </div>
          </Show>
        </Show>
      </article>
    </Show>
  )
}
