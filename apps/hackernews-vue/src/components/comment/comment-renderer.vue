<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { itemURI, type CommentData } from '@repo/hn-core'
import Comment from './comment.vue'
import getData from '../../utils/get-data'

const {
  commentId,
  disableChildren = false,
  showParent = false,
  renderAsList = false,
} = defineProps<{
  commentId: number
  disableChildren?: boolean
  showParent?: boolean
  renderAsList?: boolean
}>()

const comment = ref<CommentData>()

onBeforeMount(async () => {
  const data = await getData<CommentData>(itemURI(commentId))
  if (data?.type === 'comment' && !data.dead && !data.deleted) comment.value = data
})
</script>

<template>
  <template v-if="comment">
    <li v-if="renderAsList" class="list-item">
      <Comment :comment="comment" :disable-children="disableChildren" :show-parent="showParent" />
    </li>
    <Comment v-else :comment="comment" :disable-children="disableChildren" :show-parent="showParent" />
  </template>
</template>

<style scoped>
  .list-item {
    list-style: '▲';

    &::marker {
      font-size: 11px;
      color: var(--gray);
    }
  }
</style>