<script setup lang="ts">
const id = String(useRoute().params.id)

const { data, error } = await useAsyncData(`item:${id}`, () => loadItem(id))
if (error.value) throw upstreamError()
if (!data.value) throw notFound()
const item = data.value

// The whole comment tree in one Algolia request; a skeleton shows while it loads.
const { data: thread, status, refresh } = useLazyAsyncData(`thread:${id}`, () => loadThread(id))

useHead({ title: item.type === 'comment' ? `Comment by ${item.by}` : item.title })
</script>

<template>
  <article v-if="item.type === 'comment'" class="comment">
    <h1 class="comment-header">
      <NuxtLink :to="`/user/${item.by}`">{{ item.by }}</NuxtLink>
      &nbsp;<RelTime :unix="item.time" /> &nbsp;|&nbsp;<NuxtLink :to="`/comments/${item.parent}`"
        >parent</NuxtLink
      >
    </h1>
    <div class="comment-content" v-html="item.text" />
  </article>
  <StoryItem v-else :story="item" heading="h1" show-text />

  <section class="comment-list" aria-label="Comments">
    <LoadError v-if="status === 'error'" what="comments" @retry="refresh()" />
    <template v-else-if="thread && status === 'success'">
      <CommentItem v-for="comment in thread" :key="comment.id" :comment="comment" />
      <p v-if="!thread.length" class="status">No comments yet.</p>
    </template>
    <Loading v-else label="Loading comments" />
  </section>
</template>
