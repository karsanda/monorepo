<script lang="ts">
  import { isoTime, timeAgo } from '@repo/hn-core'
  import { resolve } from '$app/paths'
  import Comment from '$lib/components/comment.svelte'
  import LoadError from '$lib/components/load-error.svelte'
  import Loading from '$lib/components/loading.svelte'
  import Story from '$lib/components/story.svelte'
  import { pageTitle } from '$lib/meta'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()

  const item = $derived(data.item)
  const title = $derived(item.type === 'comment' ? `Comment by ${item.by}` : item.title)
</script>

<svelte:head>
  <title>{pageTitle(title)}</title>
</svelte:head>

{#if item.type === 'comment'}
  <article class="comment">
    <h1 class="comment-header">
      <a href={resolve('/user/[id]', { id: item.by })}>{item.by}</a>
      &nbsp;<time datetime={isoTime(item.time)}>{timeAgo(item.time)}</time>
      &nbsp;|&nbsp;<a href={resolve('/comments/[id]', { id: String(item.parent) })}>parent</a>
    </h1>
    <div class="comment-content">{@html item.text}</div>
  </article>
{:else}
  <Story story={item} heading="h1" showText />
{/if}

<section class="comment-list" aria-label="Comments">
  {#await data.thread}
    <Loading label="Loading comments" />
  {:then comments}
    {#each comments as comment (comment.id)}
      <Comment {comment} />
    {:else}
      <p class="status">No comments yet.</p>
    {/each}
  {:catch}
    <LoadError what="comments" />
  {/await}
</section>
