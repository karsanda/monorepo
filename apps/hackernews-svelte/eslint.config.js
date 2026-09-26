import svelte from '@repo/eslint-config/svelte'
import { defineConfig } from 'eslint/config'
import svelteConfig from './svelte.config.js'

export default defineConfig([
  svelte(svelteConfig),
  {
    rules: {
      // Story/comment/user text comes from the HN API as HTML and is rendered as such.
      'svelte/no-at-html-tags': 'off',
    },
  },
])
