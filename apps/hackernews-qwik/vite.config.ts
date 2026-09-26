import { qwikVite } from '@builder.io/qwik/optimizer'
import { qwikCity } from '@builder.io/qwik-city/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
  // Same URLs as the other apps: /newstories, not /newstories/.
  plugins: [qwikCity({ trailingSlash: false }), qwikVite()],
  resolve: { alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) } },
  preview: { headers: { 'Cache-Control': 'public, max-age=600' } },
}))
