<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { itemURI, type CommentData, type StoryData } from '@repo/hn-core'
import getData from '../../utils/get-data'

defineOptions({ name: 'CommentParent' })

const { itemId } = defineProps<{ itemId: number }>()
const item = ref<CommentData | StoryData>()

onBeforeMount(async () => {
  item.value = await getData<CommentData | StoryData>(itemURI(itemId))
})
</script>

<template>
  <span v-if="item?.type === 'story'" class="story">
    on <router-link :to="`/comments/${item.id}`" target="_blank" rel="noreferrer">{{ item.title }}</router-link> 
  </span>
  <CommentParent v-else-if="item?.type === 'comment'" :item-id="item.parent" />
</template>

<style scoped>
  .story {
    color: var(--gray);

    & > a {
      color: var(--gray);
    }
  }
</style>