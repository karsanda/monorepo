import solidPlugin from 'eslint-plugin-solid/configs/typescript'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import base from './base.js'

/** SolidStart apps: eslint-plugin-solid's TypeScript rules (reactivity, JSX, props). */
export default defineConfig([
  base,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    ...solidPlugin,
  },
  { ignores: ['.output', '.nitro', '.solid'] },
  // Service workers served from public/, e.g. sw.js.
  { files: ['public/**/*.js'], languageOptions: { globals: globals.serviceworker } },
])
