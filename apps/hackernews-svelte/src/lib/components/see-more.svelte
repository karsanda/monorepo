<script lang="ts">
  import { resolve } from '$app/paths'
  import type { StoryType } from '@repo/hn-core'

  interface Pagination {
    page: number
    prev: boolean
    next: boolean
  }

  let { pagination, slug }: { pagination: Pagination; slug: StoryType } = $props()
</script>

<div class='see-more'>
  {#if pagination.prev}
    <a href="{resolve('/[[slug=storytype]]', { slug })}?page={pagination.page - 1}">
      Prev Page
    </a>
  {/if}
  {#if pagination.next}
    <a href="{resolve('/[[slug=storytype]]', { slug })}?page={pagination.page + 1}">
      Next Page
    </a>
  {/if}
</div>

<style>
  .see-more {
    margin-top: 15px;
    margin-left: 32px;
  }
</style>
