import type { MetadataRoute } from 'next'
import { APP_NAME } from '@/lib/meta'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: 'HN Next',
    description: 'Hacker News reader built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#282c34',
    theme_color: '#0070f3',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
