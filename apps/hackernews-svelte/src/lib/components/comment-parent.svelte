<script lang="ts">
  import type { CommentData, StoryData } from '@repo/hn-core'
  import { resolve } from '$app/paths'
  import { getItem } from '$lib/hn'
  import Self from './comment-parent.svelte'

  let { id }: { id: number } = $props()
</script>

{#await getItem<CommentData | StoryData>(fetch, id) then data}
  {#if data && !data.dead && !data.deleted}
    {#if data.type === 'story'}
      <span class="story">
        on <a href={resolve('/comments/[id]', { id: String(data.id) })}>{data.title}</a>
      </span>
    {:else if data.type === 'comment'}
      <Self id={data.parent} />
    {/if}
  {/if}
{/await}

<style>
  .story {
    color: var(--gray);
  }

  .story > a {
    color: var(--gray);
  }
</style>
