<script lang="ts">
  import { formatJoinDate } from '@repo/hn-core'
  import Submissions from '$lib/components/submissions.svelte'
  import { pageTitle } from '$lib/meta'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<svelte:head>
  <title>{pageTitle(`Profile: ${data.user.id}`)}</title>
</svelte:head>

<h1 class="visually-hidden">Profile: {data.user.id}</h1>

<dl class="user-grid">
  <dt>User:</dt>
  <dd>{data.user.id}</dd>
  <dt>Karma:</dt>
  <dd>{data.user.karma}</dd>
  <dt>Created:</dt>
  <dd>{formatJoinDate(data.user.created)}</dd>
  {#if data.user.about}
    <dt>About:</dt>
    <dd class="about">{@html data.user.about}</dd>
  {/if}
</dl>

{#key data.user.id}
  <Submissions user={data.user.id} firstStories={data.stories} />
{/key}
