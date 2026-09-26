<script lang="ts">
  import type { CommentData } from '@repo/hn-core'
  import { getItem } from '$lib/hn'
  import Comment from './comment.svelte'

  let { id, showParent = false }: { id: number; showParent?: boolean } = $props()
</script>

{#await getItem<CommentData>(fetch, id) then child}
  {#if child}
    <Comment data={child} {showParent} />
  {/if}
{/await}
