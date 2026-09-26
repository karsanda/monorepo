import vue from '@repo/eslint-config/vue'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  vue,
  {
    rules: {
      // File names mirror the React/Svelte apps (stories, comments, …); none clash with HTML elements.
      'vue/multi-word-component-names': 'off',
      // Story/comment/user text comes from the HN API as HTML and is rendered as such.
      'vue/no-v-html': 'off',
    },
  },
])
