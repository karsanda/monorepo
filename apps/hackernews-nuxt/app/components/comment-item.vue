<script setup lang="ts">
import type { ThreadComment } from '@repo/hn-core'

const { comment } = defineProps<{ comment: ThreadComment }>()

const collapsed = ref(false)
</script>

<template>
  <!-- Deleted comments are only worth showing when they have replies. -->
  <article v-if="comment.by || comment.kids.length" class="comment">
    <div class="comment-header">
      <button
        class="collapse-button"
        type="button"
        :aria-expanded="!collapsed"
        :aria-label="`${collapsed ? 'Expand' : 'Collapse'} comment by ${comment.by ?? 'deleted user'}`"
        @click="collapsed = !collapsed"
      >
        <span aria-hidden="true">{{ collapsed ? '▶' : '▼' }}</span>
      </button>
      <NuxtLink v-if="comment.by" :to="`/user/${comment.by}`"
        ><strong>{{ comment.by }}</strong></NuxtLink
      >
      <template v-else>[deleted]</template>
      &nbsp;<RelTime :unix="comment.time" />
    </div>

    <template v-if="!collapsed">
      <div v-if="comment.text" class="comment-content" v-html="comment.text" />
      <div v-if="comment.kids.length" class="comment-children">
        <CommentItem v-for="kid in comment.kids" :key="kid.id" :comment="kid" />
      </div>
    </template>
  </article>
</template>
