<script lang="ts">
  import { isoTime, timeAgo, type ThreadComment } from '@repo/hn-core'
  import { resolve } from '$app/paths'
  import Self from './comment.svelte'

  let { comment }: { comment: ThreadComment } = $props()

  let collapsed = $state(false)
</script>

<!-- Deleted comments are only worth showing when they have replies. -->
{#if comment.by || comment.kids.length}
  <article class="comment">
    <div class="comment-header">
      <button
        class="collapse-button"
        type="button"
        aria-expanded={!collapsed}
        aria-label="{collapsed ? 'Expand' : 'Collapse'} comment by {comment.by ?? 'deleted user'}"
        onclick={() => (collapsed = !collapsed)}
      >
        <span aria-hidden="true">{collapsed ? '▶' : '▼'}</span>
      </button>
      {#if comment.by}
        <a href={resolve('/user/[id]', { id: comment.by })}><strong>{comment.by}</strong></a>
      {:else}
        [deleted]
      {/if}
      &nbsp;<time datetime={isoTime(comment.time)}>{timeAgo(comment.time)}</time>
    </div>

    {#if !collapsed}
      {#if comment.text}
        <div class="comment-content">{@html comment.text}</div>
      {/if}
      {#if comment.kids.length}
        <div class="comment-children">
          {#each comment.kids as kid (kid.id)}
            <Self comment={kid} />
          {/each}
        </div>
      {/if}
    {/if}
  </article>
{/if}
