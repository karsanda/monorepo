<script setup lang="ts">
const { what } = defineProps<{ what: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <p class="status" role="alert">
    Couldn't load {{ what }}. Hacker News may be slow right now;
    <button class="link-button" type="button" @click="emit('retry')">try again</button>.
  </p>
</template>
