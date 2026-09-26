import vue from '@repo/eslint-config/vue'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['.nuxt', '.output']),
  vue,
  {
    rules: {
      // Page and component names follow Nuxt's file-based routing (index, [id], error, …).
      'vue/multi-word-component-names': 'off',
      // Story/comment/user text comes from the HN API as HTML and is rendered as such.
      'vue/no-v-html': 'off',
    },
  },
  {
    // Nuxt auto-imports (useRoute, computed, …) are globals ESLint can't see; TypeScript checks
    // them instead.
    files: ['**/*.{ts,vue}'],
    rules: { 'no-undef': 'off' },
  },
])
