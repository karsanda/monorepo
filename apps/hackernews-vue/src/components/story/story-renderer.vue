<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { itemURI, type StoryData } from '@repo/hn-core'
import Story from './story.vue'
import getData from '../../utils/get-data'

const {
  storyId,
  showText = false,
  renderAsList = false,
} = defineProps<{
  storyId: number
  showText?: boolean
  renderAsList?: boolean
}>()

const story = ref<StoryData>()

onBeforeMount(async () => {
  const data = await getData<StoryData>(itemURI(storyId))
  if (data?.type === 'story') story.value = data
})
</script>

<template>
  <template v-if="story">
    <li v-if="renderAsList" class="list-item">
      <Story :story="story" :show-text="showText" />
    </li>
    <Story v-else :story="story" :show-text="showText" />
  </template>
</template>

<style scoped>
  .list-item {
    color: var(--gray);

    & + & {
      margin-top: 10px;
    }
  }
</style>