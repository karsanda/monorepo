<script setup lang="ts">
import { getPage, STORY_TYPE_TITLES, type StoryType } from '@repo/hn-core'

const { type } = defineProps<{ type: StoryType }>()

const route = useRoute()
const page = computed(() => getPage(queryString(route.query.page)))

// Rendered on the server; on client-side navigation the page switches at once and shows a
// skeleton while the stories load.
const { data, status, refresh } = useLazyAsyncData(
  () => `stories:${type}:${page.value}`,
  () => loadStories(type, page.value),
)

const title = computed(
  () => STORY_TYPE_TITLES[type] + (page.value > 1 ? ` (page ${page.value})` : ''),
)
useHead({ title })
</script>

<template>
  <h1 class="visually-hidden">{{ title }}</h1>

  <LoadError v-if="status === 'error'" what="stories" @retry="refresh()" />
  <template v-else-if="data && status === 'success'">
    <StoryList :stories="data.stories" label="Stories" :page="page" hideable />
    <Pager :page="page" :page-count="data.pageCount" :href="(p) => `/${type}?page=${p}`" />
  </template>
  <Loading v-else label="Loading stories" :lines="12" />
</template>
