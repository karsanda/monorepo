# Hacker News, three ways

The same [Hacker News](https://news.ycombinator.com/) reader built three times, in **React**, **Vue** and **SvelteKit**. The apps live side by side in one pnpm + Turborepo monorepo, so you can compare how each framework handles the same features. All three read from the public [Hacker News API](https://github.com/HackerNews/API) and share their types and helpers through local packages.

## What's in this repo

```
apps/
  hackernews-react/    React 19 client-side app
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

### [React](apps/hackernews-react) (`apps/hackernews-react`)

- **Stack:** React 19, React Router 8, Emotion for styling, Vite 8.
- **Data:** fetched in the browser through `@repo/firebase-adapter` by a `useFetch` hook.
- **UI details:** shimmer placeholders while stories and comments load; "Next Page" pagination.
- **Tests:** 38 Vitest + Testing Library unit tests, and a Cypress e2e test of the nav tabs.
- **Dev server:** http://localhost:3000

### [Vue](apps/hackernews-vue) (`apps/hackernews-vue`)

- **Stack:** Vue 3.5 single-file components with `<script setup>`, vue-router 5, Vite 8.
- **Data:** fetched in the browser through `@repo/firebase-adapter`; route params arrive as component props.
- **UI details:** "Prev Page" / "Next Page" pagination.
- **Tests:** Vitest + Vue Test Utils unit tests for the story info line.
- **Dev server:** http://localhost:3001

### [SvelteKit](apps/hackernews-svelte) (`apps/hackernews-svelte`)

- **Stack:** Svelte 5 with runes, SvelteKit 2, Vite 8, deployed to Vercel.
- **Data:** pages are rendered on the server, which calls the HN REST API. Story lists stream in after the page shell arrives. Comment replies and parent-story links are fetched in the browser over REST. The user page's Submissions/Comments tabs load through `@repo/firebase-adapter`.
- **UI details:** "Prev Page" / "Next Page" pagination; unknown story types return a 404.
- **Tests:** Playwright e2e tests for the home page, pagination, nav tabs and the 404.
- **Dev server:** http://localhost:5173

## Shared packages

| Package                                                 | What it provides                                                                                                                                                                  |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@repo/hn-core`](packages/hn-core)                     | HN types, a fetch-based client for the HN REST API and Algolia (caching, concurrency limit, one-request comment threads, search), date/domain formatting, nav tabs and pagination |
| [`@repo/hn-styles`](packages/hn-styles)                 | Shared CSS: light/dark theme tokens derived from one `--brand` color, base styles and component classes                                                                           |
| [`@repo/e2e`](packages/e2e)                             | The shared Playwright suite; `APP=<name>` picks the app to build, serve and test                                                                                                  |
| [`@repo/firebase-adapter`](packages/firebase-adapter)   | Small wrapper around the HN Firebase database, used by all three apps                                                                                                             |
| [`@repo/eslint-config`](packages/eslint-config)         | ESLint flat configs: `base`, `react`, `vue`, `svelte`                                                                                                                             |
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

End-to-end tests run against a production build (`vite preview`) and hit the live HN API:

```sh
pnpm --filter hackernews-react e2e                               # Cypress, port 3000
pnpm --filter hackernews-svelte exec playwright install chromium # once, to get the browser
pnpm --filter hackernews-svelte test:integration                 # Playwright, port 4173
```

The Vue app has no e2e suite.

[`packages/e2e`](packages/e2e) holds the shared suite that every app will have to pass: same routes, same accessible names, same behavior. It describes the target feature set (search, dark mode, hidden stories, 404s, per-page titles) and replaces the per-app suites as each app is brought up to it:

```sh
pnpm --filter @repo/e2e exec playwright install chromium   # once
APP=svelte pnpm --filter @repo/e2e e2e
```

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes to `main` and on pull requests. It installs with `--frozen-lockfile`, runs `pnpm format:check`, then runs `pnpm turbo run lint typecheck test build`. E2E tests don't run in CI.

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
- **`allowBuilds`.** Dependency install scripts are blocked unless listed there. Only `cypress` and `esbuild` are allowed. If a new dependency needs its install script, add it with `pnpm approve-builds`.

## Deployment

The SvelteKit app deploys to Vercel through `@sveltejs/adapter-vercel`. The React and Vue apps build to static `dist/` folders.

## License

[MIT](LICENSE)
