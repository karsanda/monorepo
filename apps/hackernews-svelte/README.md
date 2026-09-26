# Hacker News – Svelte

The reference app: Svelte 5 (runes) + SvelteKit 2, server-rendered and deployed with `@sveltejs/adapter-vercel`. The other apps copy its behavior, and it passes the shared suite in [`packages/e2e`](../../packages/e2e).

- **Data:** every page loads on the server through the shared `@repo/hn-core` client (`src/lib/hn.ts`), whose cache is shared across requests. Story lists and comment threads stream in after the page shell; a whole thread is one Algolia request. The user page's "Load more" fetches from the browser.
- **Routes:** `/` and `/<storytype>` share one `[[slug=storytype]]` route; also `/comments/[id]`, `/user/[id]`, `/search` and `+error.svelte`.
- **Preferences:** the theme lives in a cookie so `hooks.server.ts` can render it without a flash; hidden and read stories live in localStorage (`src/lib/prefs.svelte.ts`).
- **Offline:** `src/service-worker.ts` caches the build and falls back to the last copy of pages you've visited.
- **Tests:** Vitest for the server loads, the param matcher and the comment component (`pnpm test`); end-to-end with `APP=svelte pnpm --filter @repo/e2e e2e`.

See the [root README](../../README.md) for setup and commands.
