import { qwikEslint9Plugin } from 'eslint-plugin-qwik'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import base from './base.js'

/**
 * Qwik apps: eslint-plugin-qwik's recommended rules. `valid-lexical-scope` needs type
 * information, so TypeScript files are linted with the project service.
 */
export default defineConfig([
  base,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { projectService: true },
    },
    extends: [qwikEslint9Plugin.configs.recommended],
  },
  { ignores: ['server', 'dist', '.vercel', 'tmp'] },
  // Service workers served from public/, e.g. sw.js.
  { files: ['public/**/*.js'], languageOptions: { globals: globals.serviceworker } },
])
