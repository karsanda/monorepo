import type { NextConfig } from 'next'

const config: NextConfig = {
  // hn-core and hn-styles ship TypeScript and CSS sources, not builds.
  transpilePackages: ['@repo/hn-core', '@repo/hn-styles'],
  async headers() {
    // Browsers must always check for a new service worker.
    return [{ source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] }]
  },
}

export default config
