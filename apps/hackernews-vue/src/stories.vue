<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { typeURI } from './utils/api-list'
  import { PAGE_SIZE, getPage, paginateData } from './utils/pagination'
  import getData from './utils/get-data'
  import StoryRenderer from './components/story/story-renderer.vue'

  interface StoriesProps {
    type: 'topstories' | 'newstories' | 'beststories' | 'askstories' | 'showstories' | 'jobstories'
  }

  const props = defineProps<StoriesProps>()
  const route = useRoute()

  const page = ref(getPage(route.query.page as string))
  const stories = ref([] as number[])

  watch([() => props.type, () => route.query.page], async ([newType, newPage]) => {
    const { data } = await getData<number[]>(typeURI(newType as StoriesProps['type']))
    if (data?.value) stories.value = data.value
    page.value = getPage(newPage as string)
  }, { immediate: true })
</script>

<template>
  <main class='main' aria-label="stories">
    <ol class="list" :start="(page * 30) - 29">
      <StoryRenderer
        v-for="story in paginateData(stories, page)"
        :key="story"
        :story-id="story"
        :show-text=false
        :render-as-list=true
      />
    </ol>
    <section class="pagination">
      <router-link class="prev-page" :to="`/${type}?page=${page - 1}`" v-if="page > 1">
        Prev Page
      </router-link>
      <router-link class="next-page" :to="`/${type}?page=${page + 1}`" v-if="page < Math.ceil(stories.length / PAGE_SIZE)">
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