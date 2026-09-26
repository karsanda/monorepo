# Hacker News – Qwik City

Qwik 1.20 and Qwik City. Every page loads in a `routeLoader$` on the server and is resumed, not hydrated, in the browser. Deploys to Vercel's edge runtime (`adapters/vercel-edge`); locally, `build.preview` + `preview` serve the same app from Node.

```
src/
  routes/       /, /[type], /comments/[id], /user/[id], /search, [...rest] (404)
  components/   story list, recursive comments, header, user submissions, …
  lib/          hn client, data loaders, prefs context
  entry.ssr.tsx, entry.preview.tsx, entry.vercel-edge.tsx
public/sw.js    offline service worker
```

```sh
pnpm --filter hackernews-qwik dev                  # http://localhost:3003
pnpm --filter hackernews-qwik test
pnpm --filter hackernews-qwik build.preview && pnpm --filter hackernews-qwik preview
APP=qwik pnpm --filter @repo/e2e e2e               # shared Playwright suite
```

Qwik City 1.x supports Vite 5–7, so this app pins Vite 7 while the others use Vite 8.

See the [root README](../../README.md) for the rest.
