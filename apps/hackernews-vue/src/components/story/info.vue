<script setup lang="ts">
import { formatDistance } from 'date-fns'
import type { StoryData } from '@repo/hn-core'

const { story } = defineProps<{ story: StoryData }>()

function getCreatedTime(time: number): string | 0 {
  return time && formatDistance(time * 1000, new Date(), { addSuffix: true })
}
</script>

<template>
  <p v-if="story.type === 'job'" class="subtitle">
    {{ getCreatedTime(story.time) }}
  </p>

  <p v-else-if="story.descendants && story.descendants > 0" class="subtitle">
    {{ story.score }} points by
    <router-link :to="`/user/${story.by}`"
      ><b>{{ story.by }}</b></router-link
    >
    {{ getCreatedTime(story.time) }} |
    <router-link :to="`/comments/${story.id}`">{{ story.descendants }} comments</router-link>
  </p>

  <p v-else class="subtitle">
    {{ story.score }} points by
    <router-link :to="`/user/${story.by}`"
      ><b>{{ story.by }}</b></router-link
    >
    {{ getCreatedTime(story.time) }}
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
