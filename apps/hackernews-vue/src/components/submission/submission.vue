<script setup lang="ts">
import type { SubmissionFilter } from '@repo/hn-core'
import StoryRenderer from '../story/story-renderer.vue'
import CommentRenderer from '../comment/comment-renderer.vue'

const { id, filter } = defineProps<{
  id: number
  filter: SubmissionFilter
}>()
</script>

<template>
  <StoryRenderer
    v-if="filter !== 'COMMENTS'"
    :story-id="id"
    :show-text="false"
    :render-as-list="true"
  />
  <CommentRenderer
    v-else
    :comment-id="id"
    :disable-children="filter === 'COMMENTS'"
    :show-parent="true"
    :render-as-list="true"
  />
</template>
