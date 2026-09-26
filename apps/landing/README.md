# Landing page

A static page that links to the five apps and shows their measurements. Vite renders it at build time (`vite.config.ts`) from `metrics/metrics.json` at the repo root, so it ships no JavaScript.

```sh
pnpm --filter landing dev     # http://localhost:3004
pnpm --filter landing build
```

Each card links to its app when `LANDING_URL_<APP>` is set at build time (`LANDING_URL_NEXT`, `LANDING_URL_NUXT`, `LANDING_URL_SVELTE`, `LANDING_URL_SOLID`, `LANDING_URL_QWIK`), and to the app's source otherwise.
