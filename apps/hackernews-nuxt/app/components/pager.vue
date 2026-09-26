<script setup lang="ts">
const { page, pageCount, href } = defineProps<{
  page: number
  pageCount: number
  href: (page: number) => string
}>()
</script>

<template>
  <nav v-if="page > 1 || page < pageCount" class="pager" aria-label="Pagination">
    <NuxtLink v-if="page > 1" :to="href(page - 1)">Prev page</NuxtLink>
    <NuxtLink v-if="page < pageCount" :to="href(page + 1)">Next page</NuxtLink>
  </nav>
</template>
