<script lang="ts">
  import Story from '$lib/components/story.svelte'
  import Comment from '$lib/components/comment.svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<main class='main' aria-label='comments'>
  {#if data.story.type === 'story'}
    <Story data={data.story} showText={true} />
  {/if}

  <section class='comment-list'>
    {#await data.comments then comments}
      {#each comments as comment, i (comment?.id ?? i)}
        {#if comment}
          <Comment data={comment} />
        {/if}
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
