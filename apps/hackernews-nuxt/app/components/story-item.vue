<script setup lang="ts">
import { domainOf, type StoryData } from '@repo/hn-core'

const {
  story,
  heading = 'h2',
  showText = false,
  hideable = false,
} = defineProps<{
  story: StoryData
  heading?: 'h1' | 'h2'
  showText?: boolean
  hideable?: boolean
}>()

const prefs = usePrefs()
const commentsHref = computed(() => `/comments/${story.id}`)
const domain = computed(() => domainOf(story.url))
const comments = computed(() => story.descendants ?? 0)
const markRead = () => prefs.markRead(story.id)
</script>

<template>
  <article :class="['story', { 'story--read': prefs.read.has(story.id) }]">
    <template v-if="story.url">
      <a :href="story.url" target="_blank" rel="noopener noreferrer" @click="markRead">
        <component :is="heading" class="story-title">{{ story.title }}</component>
      </a>
      <span v-if="domain" class="story-domain">({{ domain }})</span>
    </template>
    <NuxtLink v-else :to="commentsHref" @click="markRead">
      <component :is="heading" class="story-title">{{ story.title }}</component>
    </NuxtLink>

    <p class="subtitle">
      <template v-if="story.type !== 'job'">
        {{ story.score }} points by
        <NuxtLink :to="`/user/${story.by}`"
          ><strong>{{ story.by }}</strong></NuxtLink
        >{{ ' ' }}
      </template>
      <RelTime :unix="story.time" />
      <template v-if="story.type !== 'job'">
        |
        <NuxtLink :to="commentsHref" @click="markRead">
          {{ comments === 0 ? 'discuss' : `${comments} comment${comments === 1 ? '' : 's'}` }}
        </NuxtLink>
      </template>
      <template v-if="hideable">
        |
        <button class="link-button" type="button" @click="prefs.hide(story.id)">
          hide<span class="visually-hidden"> story</span>
        </button>
      </template>
    </p>

    <div v-if="showText && story.text" class="item-text" v-html="story.text" />
  </article>
</template>
