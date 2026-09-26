<script setup lang="ts">
import { isStoryType, type StoryType } from '@repo/hn-core'

// Anything that isn't a story list is a 404.
definePageMeta({
  validate: (route) => typeof route.params.type === 'string' && isStoryType(route.params.type),
})

const route = useRoute()
const type = computed(() => route.params.type as StoryType)
</script>

<template>
  <StoriesPage :key="type" :type="type" />
</template>
