<script lang="ts">
  import { resolve } from '$app/paths'
  import Pager from '$lib/components/pager.svelte'
  import StoryList from '$lib/components/story-list.svelte'
  import { pageTitle } from '$lib/meta'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()

  const href = (page: number) =>
    `${resolve('/search')}?${new URLSearchParams({ q: data.query, page: String(page) })}`
</script>

<svelte:head>
  <title>{pageTitle(data.query ? `Search: ${data.query}` : 'Search')}</title>
</svelte:head>

<h1 class="visually-hidden">Search</h1>

{#if data.results}
  <StoryList stories={data.results.items} label="Search results" page={data.results.page} />
  <Pager page={data.results.page} pageCount={data.results.pageCount} {href} />
{:else}
  <p class="status">Type in the search box to find stories.</p>
{/if}
