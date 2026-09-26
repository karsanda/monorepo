<script setup lang="ts">
import { ref, watch } from 'vue'
import { format } from 'date-fns'
import { userURI, type SubmissionFilter, type UserData } from '@repo/hn-core'
import getData from './utils/get-data'
import Submission from './components/submission/submission.vue'

const { userId } = defineProps<{ userId: string }>()
const user = ref<UserData>()
const filter = ref<SubmissionFilter>('STORIES')

function switchTab(state: SubmissionFilter) {
  filter.value = state
}

watch(
  () => userId,
  async (id) => {
    user.value = await getData<UserData>(userURI(id))
  },
  { immediate: true },
)
</script>

<template>
  <main class="main" aria-label="user">
    <div v-if="user" class="grid">
      <span>User:</span><span>{{ user.id }}</span> <span>Karma:</span><span>{{ user.karma }}</span>
      <span>Created:</span
      ><span v-if="user.created">{{ format(user.created * 1000, 'MMMM dd, yyyy') }}</span>
      <span v-if="user.about">About:</span
      ><span v-if="user.about" class="about" v-html="user.about"></span>
    </div>
    <div v-if="user" class="submissions">
      <button
        class="button-tab"
        :class="{ active: filter === 'STORIES' }"
        @click="switchTab('STORIES')"
      >
        Submissions
      </button>
      <button
        class="button-tab"
        :class="{ active: filter === 'COMMENTS' }"
        @click="switchTab('COMMENTS')"
      >
        Comments
      </button>
      <ol v-if="user.submitted && user.submitted.length > 0" class="list">
        <Submission v-for="item in user.submitted" :id="item" :key="item" :filter="filter" />
      </ol>
    </div>
  </main>
</template>

<style scoped>
.grid {
  margin-left: 5px;
  display: grid;
  grid-template-columns: 80px calc(100% - 80px);
}

.about {
  word-break: break-word;
}

.submissions {
  margin-top: 15px;

  & > h4 {
    margin-left: 5px;
    margin-bottom: 10px;
  }
}

.button-tab {
  background: transparent;
  outline: none;
  border: none;
  margin-bottom: 10px;
  cursor: pointer;
  line-height: 1em;

  & + & {
    border-left: 1px solid var(--secondary-color);
  }

  & + article {
    margin-top: 0;
  }

  &.active {
    font-weight: 700;
  }
}

.list {
  margin: 0;
  padding-left: 28px;

  li + li {
    margin-top: 10px;
  }
}

@media only screen and (max-width: 400px) {
  .grid {
    font-size: 12px;
  }
}
</style>
