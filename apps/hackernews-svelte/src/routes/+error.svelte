<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { pageTitle } from '$lib/meta'

  const heading = $derived(page.status === 404 ? 'Not found' : 'Something went wrong')
</script>

<svelte:head>
  <title>{pageTitle(heading)}</title>
</svelte:head>

<div class="status">
  <h1>{heading}</h1>
  <p>
    {page.status === 404 ? "That page, story or user doesn't exist." : page.error?.message}
    <a href={resolve('/')}>Back to the front page</a>
  </p>
</div>
