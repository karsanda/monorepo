<script lang='ts'>
  import { onMount } from 'svelte'
  import FirebaseAdapter from 'firebase-adapter'
  import Story from './story.svelte'
  import Comment from './comment.svelte'

  export let submissions: number[]

  let activeTab = 'STORIES'
  // let items = [] as Array<CommentData|StoryData>

  function switchTab(tab: 'STORIES' | 'COMMENTS') {
    activeTab = tab
  }

  // const firebaseAdapter = new FirebaseAdapter({
  //   onSuccess: (snapshot) => {
  //     const data = snapshot.val();
  //     return data
  //   },
  //   onError: (error) => {
  //     console.error(error)
  //   }
  // })

  onMount(async () => {
    // const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${submissions}.json`)
    // const data = await res.json()

    // items.push(data)
	})
</script>

<div class='submissions'>
  <button class='tab-button' class:active={activeTab === 'STORIES'} on:click={() => switchTab('STORIES')} type='button'>
    Submissions
  </button>
  <button class='tab-button' class:active={activeTab === 'COMMENTS'} on:click={() => switchTab('COMMENTS')} type='button'>
    Comments
  </button>

  {submissions}
  <!-- <ol class='list'>
    {#each items as item}
      {#if item.type === 'story'}
        <li>
          <Story data={item} />
        </li>
      {:else if item.type === 'comment'}
        <li class='comment-item'>
          <Comment data={item} disableChildren={activeTab === 'COMMENTS'} showParent={true} />
        </li>
      {/if}
    {/each}
  </ol> -->
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
