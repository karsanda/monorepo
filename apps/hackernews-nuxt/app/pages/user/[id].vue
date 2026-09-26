<script setup lang="ts">
import { formatJoinDate } from '@repo/hn-core'

const id = String(useRoute().params.id)

const { data, error } = await useAsyncData(`user:${id}`, () => loadUser(id))
if (error.value) throw upstreamError()
if (!data.value) throw notFound()
const { user, stories } = data.value

useHead({ title: `Profile: ${user.id}` })
</script>

<template>
  <h1 class="visually-hidden">Profile: {{ user.id }}</h1>

  <dl class="user-grid">
    <dt>User:</dt>
    <dd>{{ user.id }}</dd>
    <dt>Karma:</dt>
    <dd>{{ user.karma }}</dd>
    <dt>Created:</dt>
    <dd>{{ formatJoinDate(user.created) }}</dd>
    <template v-if="user.about">
      <dt>About:</dt>
      <dd class="about" v-html="user.about" />
    </template>
  </dl>

  <UserSubmissions :key="user.id" :user="user.id" :first-stories="stories" />
</template>
