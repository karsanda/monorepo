<script setup lang="ts">
import { firstItemIndex, type StoryData } from '@repo/hn-core'

const {
  stories,
  label,
  page = 1,
  hideable = false,
} = defineProps<{ stories: StoryData[]; label: string; page?: number; hideable?: boolean }>()

const prefs = usePrefs()
const visible = computed(() =>
  hideable ? stories.filter((s) => !prefs.hidden.has(s.id)) : stories,
)
</script>

<template>
  <ol v-if="visible.length" class="story-list" :aria-label="label" :start="firstItemIndex(page)">
    <li v-for="story in visible" :key="story.id">
      <StoryItem :story="story" :hideable="hideable" />
    </li>
  </ol>
  <p v-else class="status">Nothing here yet.</p>
</template>
