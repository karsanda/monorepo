<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import { itemURI } from '../../utils/api-list'
  import getData from '../../utils/get-data'

  const { itemId } = defineProps<{ itemId: number }>()
  const item = ref({} as CommentData | StoryData)

  onBeforeMount(async () => {
    const { data } = await getData<CommentData | StoryData>(itemURI(itemId.toString()))
    if (data?.value) item.value = data.value
  })
</script>

<template>
  <span class="story" v-if="item.type === 'story'">
    on <router-link :to="`/comments/${item.id}`" target="_blank" rel="noreferrer">{{ item.title }}</router-link> 
  </span>
  <Parent v-else-if="item.type === 'comment'" :id="item.parent" />
</template>

<style scoped>
  .story {
    color: var(--gray);

    & > a {
      color: var(--gray);
    }
  }
</style>