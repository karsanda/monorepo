<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import Story from './story.vue'
  import { itemURI } from '../../utils/api-list'
  import getData from '../../utils/get-data'

  interface Props {
    storyId: number
    showText?: boolean
    renderAsList?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    showText: false,
    renderAsList: false
  })

  const story = ref({} as StoryData)
  const shouldBeRendered = ref(false)

  onBeforeMount(async () => {
    const { data } = await getData<StoryData>(itemURI(props.storyId.toString()))

    if (data?.value) {
      story.value = data.value
      shouldBeRendered.value = story.value.type === 'story'
    }
  })
</script>

<template>
  <li class="list-item" v-if="renderAsList && shouldBeRendered">
    <Story :story="story" :showText="showText" />
  </li>
  <Story v-else-if="!renderAsList && shouldBeRendered" :story="story" :showText="showText" />
</template>

<style scoped>
  .list-item {
    color: var(--gray);

    & + & {
      margin-top: 10px;
    }
  }
</style>