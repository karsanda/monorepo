// Offline support. Hashed build assets are cached on first use and served from the cache;
// pages, RSC payloads and HN API responses go to the network first and fall back to the last
// copy, so pages you've visited still open offline.
const CACHE = 'hn-next-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  const sameOrigin = url.origin === self.location.origin
  const hnApi = url.hostname.endsWith('firebaseio.com') || url.hostname === 'hn.algolia.com'
  if (!sameOrigin && !hnApi) return

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)
      if (sameOrigin && url.pathname.startsWith('/_next/static/')) {
        const cached = await cache.match(request)
        if (cached) return cached
      }
      try {
        const response = await fetch(request)
        if (response.ok) cache.put(request, response.clone())
        return response
      } catch (err) {
        const cached = await cache.match(request)
        if (cached) return cached
        throw err
      }
    })(),
  )
})
