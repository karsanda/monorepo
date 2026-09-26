# @repo/e2e

One Playwright suite that every Hacker News app must pass, so the apps stay identical in behavior. It builds the chosen app, serves its production build and runs the tests against it (and the live HN API).

```sh
pnpm --filter @repo/e2e exec playwright install chromium   # once
APP=svelte pnpm --filter @repo/e2e e2e
```

`APP` is one of the keys in [`apps.ts`](apps.ts), which says how to build and serve each app.
