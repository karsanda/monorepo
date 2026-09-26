# Hacker News, three ways

The same [Hacker News](https://news.ycombinator.com/) reader built in **React**, **Vue** and **SvelteKit**, sharing data-access code in a pnpm + Turborepo monorepo. Each app has top/new/best/ask/show/job story lists with pagination, threaded comments with collapsing, and user pages with a submissions/comments filter.

## Apps and packages

| Path                                                       | What                                                               | Dev port |
| ---------------------------------------------------------- | ------------------------------------------------------------------ | -------- |
| [`apps/hackernews-react`](apps/hackernews-react)           | React 19, React Router 8, Emotion, client-side via Firebase SDK    | 3000     |
| [`apps/hackernews-vue`](apps/hackernews-vue)               | Vue 3.5 (`<script setup>`), vue-router 5, client-side via Firebase | 3001     |
| [`apps/hackernews-svelte`](apps/hackernews-svelte)         | Svelte 5 (runes) + SvelteKit 2, server loads over REST, Vercel     | 5173     |
| [`packages/hn-core`](packages/hn-core)                     | Shared types (`StoryData`, …), pagination and API path helpers     |          |
| [`packages/firebase-adapter`](packages/firebase-adapter)   | Thin wrapper around the HN Firebase Realtime Database              |          |
| [`packages/eslint-config`](packages/eslint-config)         | Shared ESLint flat configs (base / react / vue / svelte)           |          |
| [`packages/typescript-config`](packages/typescript-config) | Shared `tsconfig` bases                                            |          |

## Requirements

- Node.js ≥ 22.22
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
- **`allowBuilds`.** Dependency install scripts are blocked unless listed there. Only `cypress` and `esbuild` are allowed. If a new dependency needs its install script, add it with `pnpm approve-builds`.

## Deployment

The SvelteKit app deploys to Vercel through `@sveltejs/adapter-vercel`. The React and Vue apps build to static `dist/` folders.
