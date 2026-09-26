<script lang="ts">
  let {
    page,
    pageCount,
    href,
  }: { page: number; pageCount: number; href: (page: number) => string } = $props()
</script>

{#if page > 1 || page < pageCount}
  <nav class="pager" aria-label="Pagination">
    <!-- eslint-disable svelte/no-navigation-without-resolve -- `href` builds resolved app URLs -->
    {#if page > 1}<a href={href(page - 1)}>Prev page</a>{/if}
    {#if page < pageCount}<a href={href(page + 1)}>Next page</a>{/if}
    <!-- eslint-enable svelte/no-navigation-without-resolve -->
  </nav>
{/if}
