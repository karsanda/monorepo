<script lang="ts">
  import type { CommentData } from '@repo/hn-core'
  import { resolve } from '$app/paths'
  import { formatDistance } from 'date-fns'
  import CommentChild from './comment-child.svelte'
  import CommentParent from './comment-parent.svelte'

  let {
    data,
    disableChildren = false,
    showParent = false,
  }: { data: CommentData; disableChildren?: boolean; showParent?: boolean } = $props()

  let isCollapse = $state(false)

  const createdTime = $derived(
    data.time && formatDistance(data.time * 1000, new Date(), { addSuffix: true }),
  )
</script>

<article class="container" data-disable-children={disableChildren}>
  {#if !data.dead && !data.deleted && data.by}
    <div class="header">
      {#if !disableChildren}
        <button
          class="collapsible-button"
          type="button"
          aria-label={`collapsible-button-${data.id}`}
          onclick={() => (isCollapse = !isCollapse)}
        >
          {isCollapse ? '▼' : '▲'}
        </button>
      {/if}

      <p class="info">
        <a href={resolve('/user/[id]', { id: data.by })}><strong>{data.by}</strong></a>
        {createdTime}
        {#if showParent && data.parent}
          <CommentParent id={data.parent} />
        {/if}
      </p>
    </div>

    {#if data.text}
      <div class="content">{@html data.text}</div>
    {/if}

    {#if !disableChildren && data.kids && !isCollapse}
      <div class="children">
        {#each data.kids as kid (kid)}
          <CommentChild id={kid} />
        {/each}
      </div>
    {/if}
  {/if}
</article>

<style>
  .container {
    margin-right: 10px;
    margin-left: 5px;
  }

  :global(.container) + .container {
    margin-top: 15px;
  }

  .container[data-disable-children='true'] > div {
    margin-left: 5px;
  }

  .header {
    display: flex;
    align-items: center;
  }

  .collapsible-button {
    font-size: 12px;
    background: none;
    outline: none;
    border: none;
    margin: 0 5px 0 0;
    padding: 0;
    cursor: pointer;
    color: var(--gray);
  }

  .info {
    margin: 5px 0;
    color: var(--gray);
    font-size: 11px;
  }

  .info > a {
    color: var(--gray);
  }

  .content {
    margin-left: 17px;
    font-size: 12px;
    word-break: break-word;
  }

  .content :global(p) {
    margin: 10px 0;
  }

  .content :global(code),
  .content :global(pre) {
    white-space: pre-wrap;
  }

  .children {
    margin-left: 25px;
  }

  .children :global(.header) {
    margin-top: 10px;
  }
</style>
