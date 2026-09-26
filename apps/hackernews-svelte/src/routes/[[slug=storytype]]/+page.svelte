<script lang="ts">
  import { firstItemIndex } from '@repo/hn-core'
  import Story from '$lib/components/story.svelte'
  import SeeMore from '$lib/components/see-more.svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<main class="main" aria-label={data.slug}>
  <ol start={firstItemIndex(data.pagination.page)}>
    {#await data.stories then stories}
      {#each stories as story (story?.id)}
        {#if story}
          <li class="item">
            <Story data={story} />
          </li>
        {/if}
      {/each}
    {/await}
  </ol>

  <SeeMore slug={data.slug} pagination={data.pagination} />
</main>

<style>
  .item {
    color: var(--gray);

    & + & {
      margin-top: 10px;
    }
  }

  @media only screen and (max-width: 400px) {
    .item {
      font-size: 13px;
    }
  }
</style>
