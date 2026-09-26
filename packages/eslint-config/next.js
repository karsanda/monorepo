import nextPlugin from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import base from './base.js'

/** Next.js apps: React hooks rules plus Next's recommended and Core Web Vitals rules. */
export default defineConfig([
  base,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    extends: [reactHooks.configs.flat.recommended],
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  // Service workers served from public/, e.g. sw.js.
  { files: ['public/**/*.js'], languageOptions: { globals: globals.serviceworker } },
])
