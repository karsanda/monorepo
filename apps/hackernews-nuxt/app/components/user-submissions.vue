<script setup lang="ts">
import type { ResultPage, StoryData, UserComment } from '@repo/hn-core'

const { user, firstStories } = defineProps<{
  user: string
  /** Server-rendered first page; later pages load in the browser. */
  firstStories: ResultPage<StoryData>
}>()

type Tab = 'Submissions' | 'Comments'

interface Feed<T> {
  items: T[]
  page: number
  pageCount: number
  loading: boolean
  failed: boolean
}

const TABS: readonly Tab[] = ['Submissions', 'Comments']

const tab = ref<Tab>('Submissions')
const stories = reactive<Feed<StoryData>>({ ...firstStories, loading: false, failed: false })
// `page` 0: nothing loaded yet.
const comments = reactive<Feed<UserComment>>({
  items: [],
  page: 0,
  pageCount: 1,
  loading: false,
  failed: false,
})

async function more<T>(feed: Feed<T>, load: (page: number) => Promise<ResultPage<T>>) {
  feed.loading = true
  feed.failed = false
  try {
    const next = await load(feed.page + 1)
    feed.items.push(...next.items)
    feed.page = next.page
    feed.pageCount = next.pageCount
  } catch {
    feed.failed = true
  } finally {
    feed.loading = false
  }
}

const moreStories = () => more(stories, (page) => hn.getUserStories(user, page))
const moreComments = () => more(comments, (page) => hn.getUserComments(user, page))

function show(next: Tab) {
  tab.value = next
  if (next === 'Comments' && comments.page === 0 && !comments.loading) moreComments()
}

const feed = computed(() => (tab.value === 'Submissions' ? stories : comments))
</script>

<template>
  <div class="tabs">
    <button
      v-for="name in TABS"
      :key="name"
      class="tab-button"
      type="button"
      :aria-pressed="tab === name"
      @click="show(name)"
    >
      {{ name }}
    </button>
  </div>

  <ol v-if="feed.items.length" class="story-list" :aria-label="tab">
    <template v-if="tab === 'Submissions'">
      <li v-for="story in stories.items" :key="story.id"><StoryItem :story="story" /></li>
    </template>
    <template v-else>
      <li v-for="comment in comments.items" :key="comment.id">
        <UserComment :comment="comment" />
      </li>
    </template>
  </ol>
  <p v-else-if="!feed.loading && !feed.failed" class="status">No {{ tab.toLowerCase() }} yet.</p>

  <p v-if="feed.failed" class="status" role="alert">Couldn't load more {{ tab.toLowerCase() }}.</p>

  <p v-if="feed.loading" class="status" role="status">Loading…</p>
  <div v-else-if="feed.page < feed.pageCount" class="pager">
    <button
      class="link-button"
      type="button"
      @click="tab === 'Submissions' ? moreStories() : moreComments()"
    >
      Load more
    </button>
  </div>
</template>
