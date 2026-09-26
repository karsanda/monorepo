<script lang="ts">
  import type { StoryData } from '@repo/hn-core'
  import { resolve } from '$app/paths'
  import Information from './information.svelte'

  let { data, showText = false }: { data: StoryData; showText?: boolean } = $props()
</script>

{#if !data.dead && !data.deleted && data.by}
  <article class="item">
    {#if data.url}
      <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external story URL, not an app route -->
      <a class="title-link" href={data.url} target="_blank" rel="noreferrer">
        <h2 class="title">{data.title}</h2>
      </a>
    {:else}
      <a
        class="title-link"
        href={resolve('/comments/[id]', { id: String(data.id) })}
        target="_blank"
        rel="noreferrer"
      >
        <h2 class="title">{data.title}</h2>
      </a>
    {/if}

    <Information {data} {showText} />
  </article>
{/if}

<style>
  .item {
    width: calc(100% - 25px);
    margin-left: 5px;
  }

  .title {
    display: inline;
    color: var(--secondary-color);
    font-size: 1em;
    font-weight: 400;
    line-height: 1.25em;
  }

  .title-link:hover {
    color: var(--secondary-color);
  }
</style>
