const BRAND = '#00dc82'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },
  css: ['@repo/hn-styles/index.css', '~/assets/app.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Hacker News reader built with Nuxt' },
        { name: 'theme-color', content: BRAND },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },
  routeRules: {
    // Browsers must always check for a new service worker.
    '/sw.js': { headers: { 'cache-control': 'no-cache' } },
  },
  typescript: { strict: true },
})
