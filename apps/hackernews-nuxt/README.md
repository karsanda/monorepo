# Hacker News – Nuxt

Nuxt 4 with Vue 3.5 `<script setup>` components. Pages load through the shared `@repo/hn-core` client with `useAsyncData`: fully server-rendered on the first visit, with skeletons (`useLazyAsyncData`) on client-side navigation.

```
app/
  pages/        /, /[type], /comments/[id], /user/[id], /search
  components/   story list, recursive comment tree, header, user submissions, …
  composables/  theme cookie (useCookie), hidden/read stories, shared <head>
  utils/        hn client, data loaders, 404/502 errors
  error.vue     404 and error page
public/sw.js    offline service worker
```

```sh
pnpm --filter hackernews-nuxt dev        # http://localhost:3001
pnpm --filter hackernews-nuxt test       # Vitest + @nuxt/test-utils
APP=nuxt pnpm --filter @repo/e2e e2e     # shared Playwright suite
```

See the [root README](../../README.md) for the rest.
