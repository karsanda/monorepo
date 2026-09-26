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
pnpm format       # Prettier
```

Scope to one app with a filter, e.g. `pnpm --filter hackernews-vue dev`.

End-to-end tests (hit the live HN API):

```sh
pnpm --filter hackernews-react e2e              # Cypress against `vite preview`
pnpm --filter hackernews-svelte test:integration  # Playwright against `vite preview`
```

`packages/firebase-adapter` has one opt-in live test: `HN_LIVE=1 pnpm --filter @repo/firebase-adapter test`.
