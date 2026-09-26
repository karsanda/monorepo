import { vercelEdgeAdapter } from '@builder.io/qwik-city/adapters/vercel-edge/vite'
import { extendConfig } from '@builder.io/qwik-city/vite'
import baseConfig from '../../vite.config'

/** Server build for Vercel's edge runtime, written to `.vercel/output`. */
export default extendConfig(baseConfig, () => ({
  build: {
    ssr: true,
    rollupOptions: { input: ['src/entry.vercel-edge.tsx', '@qwik-city-plan'] },
    outDir: '.vercel/output/functions/_qwik-city.func',
  },
  plugins: [vercelEdgeAdapter()],
}))
