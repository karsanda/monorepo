<script setup lang="ts">
  import { formatDistance } from 'date-fns'

  const { story } = defineProps<{ story: StoryData }>()
  const createdTime = story.time && formatDistance(story.time * 1000, new Date(), { addSuffix: true })
</script>

<template>
  <p class="subtitle" v-if="story.type === 'job'">
    {{ createdTime }} | 
  </p>

  <p class="subtitle" v-else-if="story.descendants && story.descendants > 0">
    {{ story.score }} points by
    <!-- <router-link to="`/user/${story.by}`"> -->
      <b>{{ story.by }}</b>
    <!-- </router-link> -->
    {{ createdTime }} | 
    <!-- <router-link to="`/comments/${story.id}`"> -->
      {{ story.descendants }} comments
    <!-- </router-link> -->
  </p>

  <p class="subtitle" v-else>
    {{ story.score }} points by
    <!-- <router-link to="`/user/${story.by}`"> -->
      <b>{{ story.by }}</b>
    <!-- </router-link> -->
    {{ createdTime }} | 
  </p>
</template>

<style scoped>
  .subtitle {
    margin-top: 5px;
    color: var(--gray);
    font-size: 11px;
  }

  .subtitle > a {
    color: var(--gray);
  }

  @media only screen and (max-width: 400px) {
    .subtitle {
      font-size: 11px;
    }
  }
</style>