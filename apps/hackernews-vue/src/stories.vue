<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import Story from './components/story.vue'
  import getData from './utils/get-data'
  import { typeURI } from './utils/api-list'
  import { PAGE_SIZE, getPage, paginateData } from './utils/pagination'

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
  <main class='main'>
    <ol class="list" :start="(page * 30) - 29">
      <li class="container" v-for="story in paginateData(stories, page)" :key="story">
        <Story :storyId="story" :showText=false />
      </li>
    </ol>
    <section class="pagination">
      <router-link class="prev-page" :to="`/${type}?page=${page - 1}`" v-if="page > 1">Prev Page</router-link>
      <router-link class="next-page" :to="`/${type}?page=${page + 1}`" v-if="page < Math.ceil(stories.length / PAGE_SIZE)">Next Page</router-link>
    </section>
  </main>
</template>

<style scoped>
  .list {
    padding-left: 28px;
    margin: 0;
  }

  .container {
    color: var(--gray);

    & + & {
      margin-top: 10px;
    }
  }

  .pagination {
    display: flex;
    margin: 15px 32px 5px;
    justify-content: center;
    gap: 15px;
  }

  @media only screen and (max-width: 400px) {
    .container {
      font-size: 13px;
    }
  }
</style>