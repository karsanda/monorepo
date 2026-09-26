<script lang="ts">
  import type { StoryData } from '@repo/hn-core'
  import { resolve } from '$app/paths'
  import { formatDistance } from 'date-fns'

  let { data, showText = false }: { data: StoryData; showText?: boolean } = $props()

  const createdTime = $derived(
    data.time && formatDistance(data.time * 1000, new Date(), { addSuffix: true }),
  )
</script>

{#if data.type === 'job'}
  <p class='subtitle'>{createdTime}</p>
{:else if data.descendants && data.descendants > 0}
  <p class='subtitle'>
    {data.score} points by
    <a href={resolve('/user/[id]', { id: data.by })}><strong>{data.by}</strong></a>
    {createdTime} |
    <a href={resolve('/comments/[id]', { id: String(data.id) })}>{data.descendants} comments</a>
  </p>
{:else}
  <p class='subtitle'>
    {data.score} points by <a href={resolve('/user/[id]', { id: data.by })}><strong>{data.by}</strong></a>
    {createdTime}
  </p>
{/if}

{#if showText && data.text}
  <div class='text'>{@html data.text}</div>
{/if}

<style>
  .subtitle {
    margin-top: 5px;
    color: var(--gray);
    font-size: 11px;
  }

  .subtitle > a {
    color: var(--gray);
  }

  .text {
    margin-top: 15px;
    margin-left: 6px;
    font-size: 12px;
    color: var(--gray);
  }

  .text :global(p) {
    margin: 10px 0;
  }

  .text :global(code),
  .text :global(pre) {
    white-space: pre-wrap;
  }

  @media only screen and (max-width: 400px) {
    .subtitle {
      font-size: 11px;
    }
  }
</style>
