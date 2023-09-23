<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import FirebaseAdapter from 'firebase-adapter'
  import Story from './components/story.vue'
  import { typeURI } from './utils/api-list'
  import { PAGE_SIZE, getPage, paginateData } from './utils/pagination'

  interface StoriesProps {
    type: 'topstories' | 'newstories' | 'beststories' | 'askstories' | 'showstories' | 'jobstories'
  }

  const props = defineProps<StoriesProps>()
  const route = useRoute()

  const page = getPage(route.query.page as string)
  const stories = ref([] as number[])

  const firebaseAdapter = new FirebaseAdapter({
    onSuccess: (snapshot) => {
      const data = snapshot.val()
      stories.value = data
    }
  })

  firebaseAdapter.fetchData(typeURI(props.type))
</script>

<template>
  <main class='main'>
    <ol class="list" :start="(page * 30) - 29">
      <li class="container" v-for="story in paginateData(stories, page)" :key="story">
        <Story :storyId="story" :showText=false />
      </li>
    </ol>
    <div class="see-more" v-if="page < Math.ceil(stories.length / PAGE_SIZE)">
      <router-link :to="`/${type}?page=${page + 1}`">Next Page</router-link>
    </div>
  </main>
</template>

<style scoped>
  .list {
    padding-left: 28px;
    margin: 0;
  }

  .see-more {
    margin-top: 15px;
    margin-left: 32px;
  }

  .container {
    color: var(--gray);

    & + & {
      margin-top: 10px;
    }
  }

  @media only screen and (max-width: 400px) {
    .container {
      font-size: 13px;
    }
  }
</style>