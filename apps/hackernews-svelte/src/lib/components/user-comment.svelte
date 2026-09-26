<script lang="ts">
  import { isoTime, timeAgo, type UserComment } from '@repo/hn-core'
  import { resolve } from '$app/paths'

  let { comment }: { comment: UserComment } = $props()
</script>

<article class="comment">
  <div class="comment-header">
    <a href={resolve('/user/[id]', { id: comment.by })}><strong>{comment.by}</strong></a>
    &nbsp;<time datetime={isoTime(comment.time)}>{timeAgo(comment.time)}</time>
    {#if comment.storyId}
      &nbsp;on&nbsp;<a href={resolve('/comments/[id]', { id: String(comment.storyId) })}>
        {comment.storyTitle}
      </a>
    {/if}
  </div>
  <div class="comment-content">{@html comment.text}</div>
</article>
