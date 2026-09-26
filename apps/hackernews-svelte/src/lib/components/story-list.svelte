<script lang="ts">
  import { firstItemIndex, type StoryData } from '@repo/hn-core'
  import { prefs } from '$lib/prefs.svelte'
  import Story from './story.svelte'

  let {
    stories,
    label,
    page = 1,
    hideable = false,
  }: { stories: StoryData[]; label: string; page?: number; hideable?: boolean } = $props()

  const visible = $derived(hideable ? stories.filter((s) => !prefs.hidden.has(s.id)) : stories)
</script>

{#if visible.length}
  <ol class="story-list" aria-label={label} start={firstItemIndex(page)}>
    {#each visible as story (story.id)}
      <li><Story {story} {hideable} /></li>
    {/each}
  </ol>
{:else}
  <p class="status">Nothing here yet.</p>
{/if}
