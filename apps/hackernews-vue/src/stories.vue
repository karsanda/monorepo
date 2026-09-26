<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  firstItemIndex,
  getPage,
  pageCount,
  paginateData,
  typeURI,
  type StoryType,
} from '@repo/hn-core'
import getData from './utils/get-data'
import StoryRenderer from './components/story/story-renderer.vue'

const { type } = defineProps<{ type: StoryType }>()
const route = useRoute()

const page = computed(() => getPage(route.query.page?.toString()))
const stories = ref<number[]>([])

watch(
  () => type,
  async (newType) => {
    stories.value = (await getData<number[]>(typeURI(newType))) ?? []
  },
  { immediate: true },
)
</script>

<template>
  <main class="main" aria-label="stories">
    <ol class="list" :start="firstItemIndex(page)">
      <StoryRenderer
        v-for="story in paginateData(stories, page)"
        :key="story"
        :story-id="story"
        :show-text="false"
        :render-as-list="true"
      />
    </ol>
    <section class="pagination">
      <router-link class="prev-page" :to="`/${type}?page=${page - 1}`" v-if="page > 1">
        Prev Page
      </router-link>
      <router-link
        class="next-page"
        :to="`/${type}?page=${page + 1}`"
        v-if="page < pageCount(stories.length)"
      >
        Next Page
      </router-link>
    </section>
  </main>
</template>

<style scoped>
.pagination {
  display: flex;
  margin: 15px 32px 5px;
  justify-content: center;
  gap: 15px;
}
</style>
