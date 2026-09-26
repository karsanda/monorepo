import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import base from './base.js'

/** @param {import('@sveltejs/kit').Config} [svelteConfig] */
export default function svelteEslintConfig(svelteConfig) {
  return defineConfig([
    base,
    svelte.configs.recommended,
    svelte.configs.prettier,
    {
      languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    {
      files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          extraFileExtensions: ['.svelte'],
          parser: tseslint.parser,
          svelteConfig,
        },
      },
    },
    prettier,
  ])
}
