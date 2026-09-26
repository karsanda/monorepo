import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

/** Shared rules for every TypeScript package in the repo. */
export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '**/build',
    '**/coverage',
    '**/.svelte-kit',
    '**/.vercel',
    '**/.next',
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
])
