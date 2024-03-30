<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { format } from 'date-fns'
  import { userURI } from './utils/api-list'
  import getData from './utils/get-data'
  import Submission from './components/submission/submission.vue'

  const route = useRoute()
  const user = ref({} as UserData)
  const filter = ref<SubmissionFilter>('STORIES')

  function switchTab(state: SubmissionFilter) {
    filter.value = state
  }

  watch(() => route.params.storyId, async () => {
    const { data } = await getData<UserData>(userURI(route.params.userId.toString()))
    if (data?.value) user.value = data.value
  }, { immediate: true })
</script>

<template>
  <main class='main' aria-label="user">
    <div class="grid">
      <span>User:</span><span>{{ user.id }}</span>
      <span>Karma:</span><span>{{ user.karma }}</span>
      <span>Created:</span><span v-if="user.created">{{ format(user.created * 1000, 'MMMM dd, yyyy') }}</span>
      <span v-if="user.about">About:</span><span class="about" v-html="user.about" v-if="user.about"></span>
    </div>
    <div class="submissions">
      <button class="button-tab" @click="switchTab('STORIES')" :class="{ active: filter === 'STORIES' }">
        Submissions
      </button>
      <button class="button-tab" @click="switchTab('COMMENTS')" :class="{ active: filter === 'COMMENTS' }">
        Comments
      </button>
      <ol class="list" v-if="user.submitted && user.submitted.length > 0">
        <Submission v-for="item in user.submitted" :id="parseInt(item)" :filter="filter" :key="item" />
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