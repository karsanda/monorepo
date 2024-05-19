<script lang='ts'>
	export let pagination
	export let slug
</script>

<div class='see-more'>
  {#if pagination.prev}
    <a href={`/${slug}?page=${pagination.page - 1}`}>
      Prev Page
    </a>
  {/if}
  {#if pagination.next}
    <a href={`/${slug}?page=${pagination.page + 1}`}>
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
