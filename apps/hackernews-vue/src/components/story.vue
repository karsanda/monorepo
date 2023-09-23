<script setup lang="ts">
  import { ref } from 'vue'
  import FirebaseAdapter from 'firebase-adapter'
  import Information from './information.vue'
  import { itemURI } from '../utils/api-list'

  interface StoryProps {
    storyId: number 
    showText?: boolean
    numbering?: boolean
  }

  const { storyId } = defineProps<StoryProps>()
  const story = ref({} as StoryData)

  const firebaseAdapter = new FirebaseAdapter({
    onSuccess: (snapshot) => {
      const data = snapshot.val()
      story.value = data
    }
  })

  firebaseAdapter.fetchData(itemURI(storyId.toString()))
</script>

<template>
  <article class="content">
    <a class="title-link" :href="story.url ? story.url : `/comments/${story.id}`" target="_blank" rel="noreferrer">
      <h2 class="title">{{ story.title }}</h2>
    </a>
    <Information :story="story" />
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