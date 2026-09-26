<script lang="ts">
  import { domainOf, isoTime, timeAgo, type StoryData } from '@repo/hn-core'
  import { resolve } from '$app/paths'
  import { prefs } from '$lib/prefs.svelte'

  let {
    story,
    heading = 'h2',
    showText = false,
    hideable = false,
  }: {
    story: StoryData
    heading?: 'h1' | 'h2'
    showText?: boolean
    hideable?: boolean
  } = $props()

  const commentsHref = $derived(resolve('/comments/[id]', { id: String(story.id) }))
  const domain = $derived(domainOf(story.url))
  const comments = $derived(story.descendants ?? 0)
  const markRead = () => prefs.markRead(story.id)
</script>

<article class="story" class:story--read={prefs.read.has(story.id)}>
  {#if story.url}
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external story URL, not an app route -->
    <a href={story.url} target="_blank" rel="noopener noreferrer" onclick={markRead}>
      <svelte:element this={heading} class="story-title">{story.title}</svelte:element>
    </a>
    {#if domain}<span class="story-domain">({domain})</span>{/if}
  {:else}
    <a href={commentsHref} onclick={markRead}>
      <svelte:element this={heading} class="story-title">{story.title}</svelte:element>
    </a>
  {/if}

  <p class="subtitle">
    {#if story.type !== 'job'}
      {story.score} points by
      <a href={resolve('/user/[id]', { id: story.by })}><strong>{story.by}</strong></a>
    {/if}
    <time datetime={isoTime(story.time)}>{timeAgo(story.time)}</time>
    {#if story.type !== 'job'}
      | <a href={commentsHref} onclick={markRead}>
        {comments === 0 ? 'discuss' : `${comments} comment${comments === 1 ? '' : 's'}`}
      </a>
    {/if}
    {#if hideable}
      | <button class="link-button" type="button" onclick={() => prefs.hide(story.id)}>
        hide<span class="visually-hidden"> story</span>
      </button>
    {/if}
  </p>

  {#if showText && story.text}
    <div class="item-text">{@html story.text}</div>
  {/if}
</article>
