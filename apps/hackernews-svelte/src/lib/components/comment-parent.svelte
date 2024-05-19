<script lang='ts'>
  import { onMount } from 'svelte'

	export let id: number

  let data = {} as CommentData | StoryData

  onMount(async () => {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    data = await res.json()
	})
</script>

{#if data && !data.dead && !data.deleted}
  {#if data.type === 'story'}
    <span class='story'>
      on <a href={`/comments/${data.id}`}>{data.title}</a>
    </span>
  {:else if data.type === 'comment'}
    <svelte:self id={data.parent} />
  {/if}
{/if}

<style>
  .story {
    color: var(--gray);
  }

  .story > a {
    color: var(--gray);
  }
</style>
