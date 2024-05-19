<script lang='ts'>
  import { onMount } from 'svelte'
  import Comment from './comment.svelte'

	export let id: number
	export let showParent: boolean = false

  let child = {} as CommentData

  onMount(async () => {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    child = await res.json()
	})
</script>

{#if child}
  <Comment data={child} showParent={showParent} />
{/if}
