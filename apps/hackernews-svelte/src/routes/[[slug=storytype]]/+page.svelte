<script lang="ts">
  import { STORY_TYPE_TITLES } from '@repo/hn-core'
  import { resolve } from '$app/paths'
  import LoadError from '$lib/components/load-error.svelte'
  import Loading from '$lib/components/loading.svelte'
  import Pager from '$lib/components/pager.svelte'
  import StoryList from '$lib/components/story-list.svelte'
  import { pageTitle } from '$lib/meta'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()

  const title = $derived(
    STORY_TYPE_TITLES[data.type] + (data.page > 1 ? ` (page ${data.page})` : ''),
  )
</script>

<svelte:head>
  <title>{pageTitle(title)}</title>
</svelte:head>

<h1 class="visually-hidden">{title}</h1>

{#await data.stories}
  <Loading label="Loading stories" lines={12} />
{:then stories}
  <StoryList {stories} label="Stories" page={data.page} hideable />
  <Pager
    page={data.page}
    pageCount={data.pageCount}
    href={(page) => `${resolve('/[[slug=storytype]]', { slug: data.type })}?page=${page}`}
  />
{:catch}
  <LoadError what="stories" />
{/await}
