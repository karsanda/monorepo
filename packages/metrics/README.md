# `@repo/metrics`

Builds, serves and measures every app. Run it from the root with `pnpm metrics`; see [Metrics](../../README.md#metrics) in the root README for what it records and its flags.

- `src/cli.ts` — orchestration and flags
- `src/bytes.ts` — JS/CSS/HTML downloaded for `/`, compressed locally
- `src/lighthouse.ts` — Lighthouse (mobile preset) on Playwright's Chromium, median run
- `src/loc.ts` — lines of hand-written source
- `src/report.ts` — markdown table, budgets and README update (unit-tested)

The apps' build and serve commands come from [`@repo/e2e/apps`](../e2e/apps.ts), shared with the e2e suite.
