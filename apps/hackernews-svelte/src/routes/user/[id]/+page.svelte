<script lang="ts">
  import { format } from 'date-fns'
  import SubmissionList from '$lib/components/submission-list.svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<main class='main' aria-label='user'>
  <div class='grid'>
    <span>User:</span><span>{data.user.id}</span>
    <span>Karma:</span><span>{data.user.karma}</span>
    <span>Created:</span><span>{format(data.user.created * 1000, 'MMMM dd, yyyy')}</span>
    {#if data.user.about}
      <span>About:</span>
      <span class='about'>
        {@html data.user.about}
      </span>
    {/if}
  </div>

  {#key data.user.id}
    <SubmissionList submissions={data.user.submitted ?? []} />
  {/key}
</main>

<style>
  .grid {
    margin-left: 5px;
    display: grid;
    grid-template-columns: 80px calc(100% - 80px);
  }

  .about {
    word-break: break-word;
  }

  @media only screen and (max-width: 400px) {
    .grid {
      font-size: 12px;
    }
  }
</style>
