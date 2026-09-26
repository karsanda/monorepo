import solid from '@repo/eslint-config/solid'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  solid,
  {
    rules: {
      // Story/comment/user text comes from the HN API as HTML and is rendered as such.
      'solid/no-innerhtml': 'off',
    },
  },
])
