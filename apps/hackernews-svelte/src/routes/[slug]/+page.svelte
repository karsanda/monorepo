<script lang='ts'>
	import type { PageData } from './$types'
  import Story from '$lib/components/story.svelte'
  import SeeMore from '$lib/components/see-more.svelte'

	export let data: PageData
</script>

<main class='main' aria-label={data.slug}>
  <ol start={(data.pagination.page * 30) - 29}>
    {#await data.stories then stories}
      {#each stories as story}
        <li class='item'>
          <Story data={story} />
        </li>
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
