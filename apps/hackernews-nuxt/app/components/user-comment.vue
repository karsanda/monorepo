<script setup lang="ts">
import type { UserComment } from '@repo/hn-core'

const { comment } = defineProps<{ comment: UserComment }>()
</script>

<template>
  <article class="comment">
    <div class="comment-header">
      <NuxtLink :to="`/user/${comment.by}`"
        ><strong>{{ comment.by }}</strong></NuxtLink
      >
      &nbsp;<RelTime :unix="comment.time" />
      <template v-if="comment.storyId">
        &nbsp;on&nbsp;<NuxtLink :to="`/comments/${comment.storyId}`">{{
          comment.storyTitle
        }}</NuxtLink>
      </template>
    </div>
    <div class="comment-content" v-html="comment.text" />
  </article>
</template>
