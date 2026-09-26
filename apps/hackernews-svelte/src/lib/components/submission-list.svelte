<script lang="ts">
  import FirebaseAdapter from '@repo/firebase-adapter'
  import { itemURI, type CommentData, type StoryData, type SubmissionFilter } from '@repo/hn-core'
  import { onMount } from 'svelte'
  import Story from './story.svelte'
  import Comment from './comment.svelte'

  let { submissions }: { submissions: number[] } = $props()

  let activeTab = $state<SubmissionFilter>('STORIES')
  let stories = $state<StoryData[]>([])
  let comments = $state<CommentData[]>([])

  const firebaseAdapter = new FirebaseAdapter({
    onSuccess: (snapshot) => snapshot.val(),
    onError: (error) => console.error(error),
  })

  const fetchItem = (id: number) =>
    firebaseAdapter.fetchData(itemURI(id)) as Promise<StoryData | CommentData | undefined>

  onMount(async () => {
    const items = (await Promise.all(submissions.map(fetchItem))).filter(
      (item) => item && !item.dead && !item.deleted,
    )

    stories = items.filter((item): item is StoryData => item?.type === 'story')
    comments = items.filter((item): item is CommentData => item?.type === 'comment')
  })
</script>

<div class="submissions">
  <button
    class="tab-button"
    class:active={activeTab === 'STORIES'}
    onclick={() => (activeTab = 'STORIES')}
    type="button"
  >
    Submissions
  </button>
  <button
    class="tab-button"
    class:active={activeTab === 'COMMENTS'}
    onclick={() => (activeTab = 'COMMENTS')}
    type="button"
  >
    Comments
  </button>

  {#if activeTab === 'STORIES'}
    <ol class="list">
      {#each stories as story (story.id)}
        <li>
          <Story data={story} />
        </li>
      {/each}
    </ol>
  {:else}
    <ol class="list">
      {#each comments as comment (comment.id)}
        <li class="comment-item">
          <Comment data={comment} disableChildren showParent />
        </li>
      {/each}
    </ol>
  {/if}
</div>

<style>
  .submissions {
    margin-top: 15px;
  }

  .tab-button {
    background: transparent;
    outline: none;
    border: none;
    margin-bottom: 10px;
    cursor: pointer;
    line-height: 1em;
  }

  .tab-button + .tab-button {
    border-left: 1px solid var(--secondary-color);
  }

  .tab-button.active {
    font-weight: 700;
  }

  .list {
    margin: 0;
  }

  .list li + li {
    margin-top: 10px;
  }

  .comment-item {
    list-style: '▲';
  }

  .comment-item::marker {
    font-size: 11px;
    color: var(--gray);
  }
</style>
