<script lang="ts">
  import type { ResultPage, StoryData, UserComment } from '@repo/hn-core'
  import { hn } from '$lib/hn'
  import Story from './story.svelte'
  import UserComment_ from './user-comment.svelte'

  let { user, firstStories }: { user: string; firstStories: ResultPage<StoryData> } = $props()

  type Tab = 'Submissions' | 'Comments'

  interface Feed<T> {
    items: T[]
    page: number
    pageCount: number
    loading: boolean
    failed: boolean
  }

  let tab = $state<Tab>('Submissions')
  // Server-rendered first page; later pages load in the browser.
  // svelte-ignore state_referenced_locally
  let stories = $state<Feed<StoryData>>({ ...firstStories, loading: false, failed: false })
  let comments = $state<Feed<UserComment>>({
    items: [],
    page: 0,
    pageCount: 1,
    loading: false,
    failed: false,
  })

  async function more<T>(feed: Feed<T>, load: (page: number) => Promise<ResultPage<T>>) {
    feed.loading = true
    feed.failed = false
    try {
      const next = await load(feed.page + 1)
      feed.items.push(...next.items)
      feed.page = next.page
      feed.pageCount = next.pageCount
    } catch {
      feed.failed = true
    } finally {
      feed.loading = false
    }
  }

  const moreStories = () => more(stories, (page) => hn.getUserStories(user, page))
  const moreComments = () => more(comments, (page) => hn.getUserComments(user, page))

  function show(next: Tab) {
    tab = next
    if (next === 'Comments' && comments.page === 0 && !comments.loading) moreComments()
  }

  const feed = $derived(tab === 'Submissions' ? stories : comments)
</script>

<div class="tabs">
  {#each ['Submissions', 'Comments'] as const as name (name)}
    <button class="tab-button" type="button" aria-pressed={tab === name} onclick={() => show(name)}>
      {name}
    </button>
  {/each}
</div>

{#if feed.items.length}
  <ol class="story-list" aria-label={tab}>
    {#if tab === 'Submissions'}
      {#each stories.items as story (story.id)}
        <li><Story {story} /></li>
      {/each}
    {:else}
      {#each comments.items as comment (comment.id)}
        <li><UserComment_ {comment} /></li>
      {/each}
    {/if}
  </ol>
{:else if !feed.loading && !feed.failed}
  <p class="status">No {tab.toLowerCase()} yet.</p>
{/if}

{#if feed.failed}
  <p class="status" role="alert">Couldn't load more {tab.toLowerCase()}.</p>
{/if}

{#if feed.loading}
  <p class="status" role="status">Loading…</p>
{:else if feed.page < feed.pageCount}
  <div class="pager">
    <button
      class="link-button"
      type="button"
      onclick={tab === 'Submissions' ? moreStories : moreComments}
    >
      Load more
    </button>
  </div>
{/if}
