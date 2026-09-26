<script setup lang="ts">
import { isoTime, timeAgo } from '@repo/hn-core'

const { unix } = defineProps<{ unix: number }>()
</script>

<template>
  <!-- The relative text can tick over between the server render and hydration. -->
  <time :datetime="isoTime(unix)" data-allow-mismatch="text">{{ timeAgo(unix) }}</time>
</template>
