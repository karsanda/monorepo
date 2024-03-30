<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import StoryRenderer from './components/story/story-renderer.vue'
  import CommentRenderer from './components/comment/comment-renderer.vue'
  import { itemURI } from './utils/api-list'
  import getData from './utils/get-data'

  const route = useRoute()
  const comments = ref({} as StoryData | CommentData)

  watch(() => route.params.storyId, async () => {
    const { data } = await getData<StoryData | CommentData>(itemURI(route.params.storyId.toString()))
    if (data?.value) comments.value = data.value
  }, { immediate: true })
</script>

<template>
  <main class='main' aria-label="comments">
    <StoryRenderer :storyId="parseInt(route.params.storyId.toString())" :showText=true v-if="comments.type === 'story'" />
    <section class="comment-list">
      <CommentRenderer :commentId="comment" v-for="comment in comments.kids" :key="comment" />
    </section>
  </main>
</template>

<style scoped>
  .comment-list {
    margin-top: 15px;
    margin-bottom: 10px;
  }
</style>