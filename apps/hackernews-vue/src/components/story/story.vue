<script setup lang="ts">
  import Info from './info.vue'

  defineProps<{
    story: StoryData
    showText?: boolean
  }>()
</script>

<template>
  <article class="content">
    <a v-if="story.url" :href="story.url" class="title-link" target="_blank" rel="noreferrer">
      <h2 class="title">{{ story.title }}</h2>
    </a>
    <router-link v-else :to="`/comments/${story.id}`" class="title-link" target="_blank" rel="noreferrer">
      <h2 class="title">{{ story.title }}</h2>
    </router-link>
    <Info :story="story" />
  </article>
  <div class="text" v-if="showText && story.text" v-html="story.text" />
</template>

<style scoped>
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

  .content {
    width: calc(100% - 25px);
    margin-left: 5px;
  }

  .text {
    margin-top: 15px;
    margin-left: 6px;
    font-size: 12px;
    color: var(--gray);
  }

  .text p {
    margin: 10px 0;
  }

  .text code, .text pre {
    white-space: pre-wrap;
  }

</style>