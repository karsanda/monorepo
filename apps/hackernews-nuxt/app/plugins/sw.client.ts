/** Registers `public/sw.js` in production builds, so visited pages open offline. */
export default defineNuxtPlugin(() => {
  if (!import.meta.dev && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
})
