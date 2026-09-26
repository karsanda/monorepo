# Hacker News – SolidStart

SolidStart 2 (a Vite 8 plugin, with Nitro 3 building the server) and Solid Router. Routes load through the shared `@repo/hn-core` client with `query` + `createAsync`; lists and comment threads stream in through `<Suspense>`, while items and users are held back (`deferStream`) so missing ones can answer 404.

```
src/
  routes/       /, /[type], /comments/[id], /user/[id], /search, [...404]
  components/   story list, recursive comments, header, user submissions, …
  lib/          hn client, data loaders, router queries, localStorage prefs, theme cookie
  entry-server.tsx / entry-client.tsx
public/sw.js    offline service worker
```

```sh
pnpm --filter hackernews-solid dev       # http://localhost:3002
pnpm --filter hackernews-solid test
APP=solid pnpm --filter @repo/e2e e2e    # shared Playwright suite
```

See the [root README](../../README.md) for the rest.
