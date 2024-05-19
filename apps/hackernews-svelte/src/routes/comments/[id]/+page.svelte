<script lang='ts'>
	import type { PageData } from './$types'
  import Story from '$lib/components/story.svelte';
  import Comment from '$lib/components/comment.svelte'

  export let data: PageData
</script>

<main class='main' aria-label='comments'>
  {#if data.story.type === 'story'}
    <Story data={data.story} showText={true} />
  {/if}

  <section class='comment-list'>
    {#await data.comments then comments}
      {#each comments as comment}
        <Comment data={comment} />
      {/each}
    {/await}
  </section>
</main>

<style>
  .comment-list {
    margin-top: 15px;
    margin-bottom: 10px;
  }
</style>
