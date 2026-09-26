<script setup lang="ts">
const { label, lines = 6 } = defineProps<{ label: string; lines?: number }>()
</script>

<template>
  <div class="status" role="status" aria-busy="true">
    <span class="visually-hidden">{{ label }}</span>
    <span
      v-for="i in lines"
      :key="i"
      class="skeleton"
      :style="{ width: `${60 + (((i - 1) * 37) % 35)}%` }"
    />
  </div>
</template>
