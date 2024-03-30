<script setup lang="ts">
  import { formatDistance } from 'date-fns'
  import Parent from './parent.vue'

  defineProps<{
    comment: CommentData 
    showParent: boolean
  }>()
</script>

<template>
  <p class="info">
    <router-link :to="`/user/${comment.by}`">
      <b>{{ comment.by }}</b>
    </router-link>
    <time class="time" v-if="comment.time">
      {{ formatDistance(comment.time * 1000, new Date(), { addSuffix: true }) }}
    </time>
    <Parent v-if="showParent && comment.parent" :item-id="comment.parent" />
  </p>
</template>

<style scoped>
  .info {
    margin: 5px 0;
    color: var(--gray);
    font-size: 11px;

    & > a {
      color: var(--gray);
    }
  }

  .time {
    margin-left: 4px;
  }
</style>