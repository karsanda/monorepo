<script setup lang="ts">
import { getPage } from '@repo/hn-core'

const route = useRoute()
const query = computed(() => queryString(route.query.q)?.trim() ?? '')
const page = computed(() => getPage(queryString(route.query.page)))

const { data: results, status } = useLazyAsyncData(
  () => `search:${query.value}:${page.value}`,
  () => loadSearch(query.value, page.value),
)

useHead({ title: () => (query.value ? `Search: ${query.value}` : 'Search') })

const href = (p: number) => `/search?${new URLSearchParams({ q: query.value, page: String(p) })}`
</script>

<template>
  <h1 class="visually-hidden">Search</h1>

  <p v-if="!query" class="status">Type in the search box to find stories.</p>
  <p v-else-if="status === 'error'" class="status" role="alert">Couldn't reach search.</p>
  <template v-else-if="results && status === 'success'">
    <StoryList :stories="results.items" label="Search results" :page="results.page" />
    <Pager :page="results.page" :page-count="results.pageCount" :href="href" />
  </template>
  <Loading v-else label="Searching" />
</template>
