/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker'

const sw = self as unknown as ServiceWorkerGlobalScope
const CACHE = `cache-${version}`
const ASSETS = new Set([...build, ...files])

sw.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([...ASSETS])))
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((k) => caches.delete(k))),
      ),
  )
})

/**
 * Build assets come from the cache. Pages, page data and API responses go to the network first
 * and fall back to the last copy, so pages you've visited still open offline.
 */
sw.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  const sameOrigin = url.origin === sw.location.origin
  const hnApi = url.hostname.endsWith('firebaseio.com') || url.hostname === 'hn.algolia.com'
  if (!sameOrigin && !hnApi) return

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)
      if (sameOrigin && ASSETS.has(url.pathname)) {
        const cached = await cache.match(url.pathname)
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
