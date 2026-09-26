<script setup lang="ts">
import { ref, watch } from 'vue'
import { itemURI, type CommentData, type StoryData } from '@repo/hn-core'
import StoryRenderer from './components/story/story-renderer.vue'
import CommentRenderer from './components/comment/comment-renderer.vue'
import getData from './utils/get-data'

const { storyId } = defineProps<{ storyId: string }>()
const item = ref<StoryData | CommentData>()

watch(
  () => storyId,
  async (id) => {
    item.value = await getData<StoryData | CommentData>(itemURI(id))
  },
  { immediate: true },
)
</script>

<template>
  <main class="main" aria-label="comments">
    <StoryRenderer v-if="item?.type === 'story'" :story-id="item.id" :show-text="true" />
    <section class="comment-list">
      <CommentRenderer v-for="comment in item?.kids" :key="comment" :comment-id="comment" />
    </section>
  </main>
</template>

<style scoped>
.comment-list {
  margin-top: 15px;
  margin-bottom: 10px;
}
</style>
