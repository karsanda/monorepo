<script setup lang="ts">
  import { ref } from 'vue'
  import CommentInfo from './info.vue'
  import CommentRenderer from './comment-renderer.vue';

  defineProps<{
    comment: CommentData 
    disableChildren: boolean
    showParent: boolean
  }>()

  const isCollapse = ref(false)

  function collapse() {
    isCollapse.value = !isCollapse.value
  }
</script>

<template>
  <article class="container" :data-disable-children=disableChildren>
    <div class="header">
      <button class="collapsible-button" :aria-label="`collapsible-button-${comment.id}`" @click="collapse()" v-if="comment.kids && !disableChildren">
        <span v-if="isCollapse">▼</span>
        <span v-else>▲</span>
      </button>
      <CommentInfo :comment="comment" :show-parent="showParent" />
    </div>
    <div class="content" v-if="comment.text" v-html="comment.text" />
    <div class="children" v-if="!disableChildren && comment.kids && !isCollapse">
      <CommentRenderer :comment-id="kid" v-for="kid in comment.kids" :key="kid" />
    </div>
  </article>
</template>

<style scoped>
  .container {
    margin-right: 10px;
    margin-left: 5px;

    & + & {
      margin-top: 15px;
    }

    &[data-disable-children="true"] > div {
      margin-left: 5px;
    }
  }

  .header {
    display: flex;
    align-items: center;
  }

  .content {
    margin-left: 17px;
    font-size: 12px;
    word-break: break-word;

    & > ::deep p {
      margin: 10px 0;
    }

    & ::deep code, & ::deep pre {
      white-space: pre-wrap;
    }
  }

  .collapsible-button {
    font-size: 12px;
    background: none;
    outline: none;
    border: none;
    margin: 0 5px 0 0;
    padding: 0;
    cursor: pointer;
    color: var(--gray);
  }

  .children {
    margin-left: 25px;

    & .header {
      margin-top: 10px;
    }
  }
</style>