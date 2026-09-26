<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{ error: NuxtError }>()

useAppHead()
const notFound = computed(() => error.statusCode === 404)
const heading = computed(() => (notFound.value ? 'Not found' : 'Something went wrong'))

useHead({ title: heading })
</script>

<template>
  <NuxtLayout>
    <div class="status">
      <h1>{{ heading }}</h1>
      <p>
        {{ notFound ? "That page, story or user doesn't exist." : error.statusMessage }}
        <a href="/" @click.prevent="clearError({ redirect: '/' })">Back to top stories</a>
      </p>
    </div>
  </NuxtLayout>
</template>
