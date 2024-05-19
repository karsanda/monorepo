<script lang='ts'>
  import { onMount } from 'svelte'
  import FirebaseAdapter from 'firebase-adapter'
  import Story from './story.svelte'
  import Comment from './comment.svelte'

  export let submissions: number[]

  let activeTab = 'STORIES'
  let stories = [] as Array<StoryData>
  let comments = [] as Array<CommentData>

  function switchTab(tab: 'STORIES' | 'COMMENTS') {
    activeTab = tab
  }

  const firebaseAdapter = new FirebaseAdapter({
    onSuccess: (snapshot) => { return snapshot.val() },
    onError: (error) => { console.error(error) }
  })

  async function fetchItems(itemId: number) {
    return await firebaseAdapter.fetchData(`/item/${itemId}`) as CommentData|StoryData
  }

  onMount(async () => {
    const data = await Promise.all(submissions.map(fetchItems))
    const filteredData = data.filter(item => !item.dead && !item.deleted)

    stories = filteredData.filter(item => item.type === 'story') as Array<StoryData>
    comments = filteredData.filter(item => item.type === 'comment') as Array<CommentData>
	})
</script>

<div class='submissions'>
  <button class='tab-button' class:active={activeTab === 'STORIES'} on:click={() => switchTab('STORIES')} type='button'>
    Submissions
  </button>
  <button class='tab-button' class:active={activeTab === 'COMMENTS'} on:click={() => switchTab('COMMENTS')} type='button'>
    Comments
  </button>

  {#await stories then stories}
    {#if activeTab === 'STORIES'}
      <ol class='list'>
        {#each stories as story}
          <li>
            <Story data={story} />
          </li>
        {/each}
      </ol>
    {/if}
  {/await}

  {#await comments then comments}
    {#if activeTab === 'COMMENTS'}
      <ol class='list'>
        {#each comments as comment}
          <li class='comment-item'>
            <Comment data={comment} disableChildren={activeTab === 'COMMENTS'} showParent={true} />
          </li>
        {/each}
      </ol>
    {/if}
  {/await}
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
