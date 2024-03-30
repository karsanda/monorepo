<script setup lang="ts">
  import { ref, onBeforeMount } from 'vue'
  import Comment from './comment.vue'
  import { itemURI } from '../../utils/api-list'
  import getData from '../../utils/get-data'

  interface Props {
    commentId: number 
    disableChildren?: boolean
    showParent?: boolean
    renderAsList?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    disableChildren: false,
    showParent: false,
    renderAsList: false
  })

  const comment = ref({} as CommentData)
  const shouldBeRendered = ref(false)

  onBeforeMount(async () => {
    const { data } = await getData<CommentData>(itemURI(props.commentId.toString()))

    if (data?.value) {
      comment.value = data.value
      shouldBeRendered.value = comment.value.type === 'comment' && !comment.value.dead && !comment.value.deleted
    }
  })
</script>

<template>
  <li class="list-item" v-if="renderAsList && shouldBeRendered">
    <Comment :comment="comment" :disable-children="disableChildren" :show-parent="showParent" />
  </li>
  <Comment v-else-if="!renderAsList && shouldBeRendered" :comment="comment" :disable-children="disableChildren" :show-parent="showParent" />
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