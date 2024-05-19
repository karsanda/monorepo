<script lang='ts'>
  import Information from './information.svelte'

	export let data: StoryData
	export let showText: boolean = false
</script>

{#if !data.dead && !data.deleted}
  <article class='item'>
    <a class='title-link' href={data.url ? data.url : `/comments/${data.id}`} target='_blank' rel='noreferrer'>
      <h2 class='title'>{data.title}</h2>
    </a>

    <Information data={data} showText={showText} />
  </article>
{/if}

<style>
  .item {
    width: calc(100% - 25px);
    margin-left: 5px;
  }

  .title {
    display: inline;
    color: var(--secondary-color);
    font-size: 1em;
    font-weight: 400;
    line-height: 1.25em;
  }

  .title-link:hover {
    color: var(--secondary-color);
  }
</style>
