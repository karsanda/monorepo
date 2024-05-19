<script lang='ts'>
  import { formatDistance } from 'date-fns'
  import CommentChild from './comment-child.svelte'
  import CommentParent from './comment-parent.svelte';

	export let data: CommentData
	export let disableChildren: boolean = false
	export let showParent: boolean = false

  let isCollapse: boolean = false

  function toggleCollapse(state: boolean) {
    isCollapse = state
  }

  const createdTime = data.time && formatDistance(data.time * 1000, new Date(), { addSuffix: true })
</script>

<article class='container' data-disable-children={disableChildren}>
  {#if !data.dead && !data.deleted}
    <div class='header'>
      {#if !disableChildren}
        <button
          class='collapsible-button'
          type='button'
          aria-label={`collapsible-button-${data.id}`}
          on:click={() => toggleCollapse(!isCollapse)}
        >
          {isCollapse ? '▼' : '▲'}
        </button>
      {/if}

      <p class='info'>
        <a href={`/user/${data.by}`}><strong>{data.by}</strong></a>
        {createdTime}
        {#if showParent && data.parent}
          <CommentParent id={data.parent} />
        {/if}
      </p>
    </div>

    {#if data.text}
      <div class='content'>{@html data.text}</div>
    {/if}

    {#if !disableChildren && data.kids && !isCollapse}
      <div class='children'>
        {#each data.kids as kid}
          <CommentChild id={kid} />
        {/each}
      </div>
    {/if}
  {/if}
</article>

<style>
  .container {
    margin-right: 10px;
    margin-left: 5px;
  }

  .container + .container {
    margin-top: 15px;
  }

  .container[data-disable-children='true'] > div {
    margin-left: 5px;
  }

  .header {
    display: flex;
    align-items: center;
  }

  .collapsible-button {
    font-size: 12px;
    background: none;
    outline: none;
    border: none;
    margin: 0 5px 0 0;
    padding: 0;
    cursor: pointer;
    color: var(--gray);
    }

  .info {
    margin: 5px 0;
    color: var(--gray);
    font-size: 11px;
  }

  .info > a {
    color: var(--gray);
  }

  .content {
    margin-left: 17px;
    font-size: 12px;
    word-break: break-word;
  }

  .children {
    margin-left: 25px;
  }

  .children .header {
    margin-top: 10px;
  }
</style>
