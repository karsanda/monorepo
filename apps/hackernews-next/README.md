# Hacker News – Next.js

Next.js 16 App Router with React 19 Server Components. Pages load data on the server through the shared `@repo/hn-core` client and stream slow parts (story items, comment threads) through `<Suspense>`. Client components are kept to the interactive bits.

```
src/
  app/          routes: /, /[type], /comments/[id], /user/[id], /search, not-found, error, manifest
  components/   story list, comment tree (server) + collapse toggle (client), header, submissions
  lib/          hn client (60 s Next data cache), data loaders, localStorage prefs, metadata
public/sw.js    offline service worker
```

```sh
pnpm --filter hackernews-next dev        # http://localhost:3000
pnpm --filter hackernews-next test
APP=next pnpm --filter @repo/e2e e2e     # shared Playwright suite
```

See the [root README](../../README.md) for the rest.
