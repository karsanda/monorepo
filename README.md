# Hacker News, three ways

The same [Hacker News](https://news.ycombinator.com/) reader built three times, in **Next.js**, **Vue** and **SvelteKit**. The apps live side by side in one pnpm + Turborepo monorepo, so you can compare how each framework handles the same features. All three read from the public [Hacker News API](https://github.com/HackerNews/API) and share their types and helpers through local packages.

## What's in this repo

```
apps/
  hackernews-next/     Next.js 16 server-rendered app (React 19, App Router)
  hackernews-vue/      Vue 3.5 client-side app
  hackernews-svelte/   SvelteKit 2 server-rendered app
packages/
  hn-core/             shared HN types, data client, formatting and pagination helpers
  hn-styles/           shared CSS: light/dark theme tokens and component classes
  e2e/                 one Playwright suite that every app must pass
  firebase-adapter/    wrapper around the HN Firebase database
  eslint-config/       shared ESLint configs
  typescript-config/   shared tsconfig bases
```

### Features (all three apps)

Every app implements the same pages at the same URLs:

| Route                                                                       | Page                                                                   |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `/`, `/topstories`                                                          | Top stories, 30 per page (`?page=2`, …)                                |
| `/newstories`, `/beststories`, `/askstories`, `/showstories`, `/jobstories` | The other HN story lists                                               |
| `/comments/:id`                                                             | A story with its threaded comments; each comment can be collapsed      |
| `/user/:id`                                                                 | A user's karma, join date and bio, plus their submissions and comments |

## Apps

### [Next.js](apps/hackernews-next) (`apps/hackernews-next`)

- **Stack:** Next.js 16 App Router with React 19 Server Components, Turbopack, deployed to Vercel.
- **Data:** pages are Server Components that load through the shared `@repo/hn-core` client; Next's data cache keeps each HN response for 60 seconds. Story lists and comment threads stream in through `<Suspense>`, and the whole comment tree renders on the server. Only the interactive parts are client components: the collapse toggle, theme toggle, hide/read state and the user page's "Load more" tabs.
- **Features:** the same as the SvelteKit app: search, a cookie-backed light/dark theme, hidden and read stories, story domains, `generateMetadata` titles, `not-found`/`error` pages, and offline support through `app/manifest.ts` and a small service worker.
- **Tests:** Vitest + Testing Library unit tests for the data loaders and client components, plus the shared Playwright suite.
- **Dev server:** http://localhost:3000

### [Vue](apps/hackernews-vue) (`apps/hackernews-vue`)

- **Stack:** Vue 3.5 single-file components with `<script setup>`, vue-router 5, Vite 8.
- **Data:** fetched in the browser through `@repo/firebase-adapter`; route params arrive as component props.
- **UI details:** "Prev Page" / "Next Page" pagination.
- **Tests:** Vitest + Vue Test Utils unit tests for the story info line.
- **Dev server:** http://localhost:3001

### [SvelteKit](apps/hackernews-svelte) (`apps/hackernews-svelte`)

- **Stack:** Svelte 5 with runes, SvelteKit 2, Vite 8, deployed to Vercel. This is the reference app: the others copy its behavior and markup, and it passes the shared e2e suite.
- **Data:** every page is rendered on the server through the shared `@repo/hn-core` client. Story lists and comment threads stream in after the page shell, and a whole comment thread is one Algolia request. The user page's Submissions/Comments tabs page through Algolia, 30 at a time.
- **Features:** search (`/search?q=`), a light/dark theme toggle saved in a cookie (no flash on load), hide stories and dimmed read stories (saved in localStorage), story domains, per-page titles, a styled 404/error page, and offline support through a service worker and web app manifest.
- **Tests:** Vitest unit tests for the server loads, the route matcher and the comment component, plus the shared Playwright suite.
- **Dev server:** http://localhost:5173

## Shared packages

| Package                                                 | What it provides                                                                                                                                                                  |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@repo/hn-core`](packages/hn-core)                     | HN types, a fetch-based client for the HN REST API and Algolia (caching, concurrency limit, one-request comment threads, search), date/domain formatting, nav tabs and pagination |
| [`@repo/hn-styles`](packages/hn-styles)                 | Shared CSS: light/dark theme tokens derived from one `--brand` color, base styles and component classes                                                                           |
| [`@repo/e2e`](packages/e2e)                             | The shared Playwright suite; `APP=<name>` picks the app to build, serve and test                                                                                                  |
| [`@repo/firebase-adapter`](packages/firebase-adapter)   | Small wrapper around the HN Firebase database, used by the Vue app                                                                                                                |
| [`@repo/eslint-config`](packages/eslint-config)         | ESLint flat configs: `base`, `next`, `vue`, `svelte`                                                                                                                              |
| [`@repo/typescript-config`](packages/typescript-config) | Shared `tsconfig` bases                                                                                                                                                           |

## Requirements

- Node.js ≥ 22.22 (CI uses the version in [`.nvmrc`](.nvmrc))
- pnpm 12 (pinned via `packageManager`; `corepack enable` or a pnpm that auto-switches versions)

## Commands

Run from the repo root (Turborepo fans each out to every package):

```sh
pnpm install
pnpm dev          # all three apps
pnpm build
pnpm test         # Vitest unit tests
pnpm lint         # ESLint
pnpm typecheck    # tsc / vue-tsc / svelte-check
pnpm format       # Prettier (write)
pnpm format:check # Prettier (check only, as in CI)
```

Scope to one app with a filter, e.g. `pnpm --filter hackernews-vue dev`.

## Testing

Unit tests use Vitest everywhere and never touch the network. The one live test in `packages/firebase-adapter` is opt-in: `HN_LIVE=1 pnpm --filter @repo/firebase-adapter test`.

End-to-end tests run against a production build and hit the live HN API.

[`packages/e2e`](packages/e2e) holds the shared suite that every app has to pass: same routes, same accessible names, same behavior (search, dark mode, hidden stories, 404s, per-page titles and more). The SvelteKit and Next.js apps pass it today; the Vue app joins when it moves to Nuxt.

```sh
pnpm --filter @repo/e2e exec playwright install chromium   # once
APP=svelte pnpm --filter @repo/e2e e2e   # or APP=next
```

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes to `main` and on pull requests. It installs with `--frozen-lockfile`, runs `pnpm format:check`, then runs `pnpm turbo run lint typecheck test build`. When that passes, an `e2e` job runs the shared Playwright suite once per app in its matrix (currently `svelte` and `next`) and uploads traces when a test fails.

To reproduce a CI run locally:

```sh
pnpm install --frozen-lockfile
pnpm format:check
TZ=UTC pnpm turbo run lint typecheck test build --force
```

GitHub runners use UTC, so any test that involves dates should freeze time to an absolute instant (e.g. `new Date('2023-12-02T09:00:00Z')`), never a local-time constructor.

## Dependency policy

[`pnpm-workspace.yaml`](pnpm-workspace.yaml) sets two supply-chain rules that apply locally, in CI and on Vercel:

- **`minimumReleaseAge: 1440`.** pnpm won't install a package version that has been public for less than 24 hours. If `pnpm install` fails with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`, either wait or use the previous release.
- **Dependabot** ([`.github/dependabot.yml`](.github/dependabot.yml)) opens grouped weekly update PRs and waits a day after each release, so its PRs respect the rule above.
- **`allowBuilds`.** Dependency install scripts are blocked unless listed there. Only `esbuild` is allowed. If a new dependency needs its install script, add it with `pnpm approve-builds`.

## Deployment

The SvelteKit app deploys to Vercel through `@sveltejs/adapter-vercel`, and the Next.js app deploys to Vercel natively (project root `apps/hackernews-next`, Next.js framework preset). The Vue app builds to a static `dist/` folder.

## License

[MIT](LICENSE)
