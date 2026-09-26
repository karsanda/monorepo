import { APPS, type AppName } from '@repo/e2e/apps'
import type { AppMetrics, MetricsFile } from '@repo/metrics/types'
import { FRAMEWORKS, REPO, type Framework } from './content.ts'

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} kB`

function card(framework: Framework, metrics: AppMetrics | undefined, url: string | undefined) {
  const source = `${REPO}/tree/main/${APPS[framework.app].dir}`
  const stats = metrics
    ? `<dl class="stats">
        <div><dt>JS for /</dt><dd>${kb(metrics.js.gzip)}</dd></div>
        <div><dt>Performance</dt><dd>${metrics.lighthouse.performance}</dd></div>
        <div><dt>Accessibility</dt><dd>${metrics.lighthouse.accessibility}</dd></div>
      </dl>`
    : ''
  return `<article class="card" style="--card-brand: ${framework.brand}">
      <h2>${escape(framework.name)}</h2>
      <p>${escape(framework.summary)}</p>
      ${stats}
      <p class="links">
        ${url ? `<a href="${escape(url)}">Open the app</a> · ` : ''}<a href="${source}">Source</a>
      </p>
    </article>`
}

function table(file: MetricsFile) {
  const rows = [...file.results].sort((a, b) => a.js.gzip - b.js.gzip)
  return `<div class="table-wrap"><table>
      <caption>What each app sends and scores for its home page, smallest JS first</caption>
      <thead><tr>
        <th scope="col">App</th><th scope="col">JS (gzip)</th><th scope="col">JS (brotli)</th>
        <th scope="col">CSS</th><th scope="col">HTML</th><th scope="col">Performance</th>
        <th scope="col">Accessibility</th><th scope="col">LCP</th><th scope="col">TBT</th>
        <th scope="col">Build</th><th scope="col">Lines of code</th>
      </tr></thead>
      <tbody>${rows
        .map(
          (r) => `<tr>
          <th scope="row">${escape(r.label)}</th>
          <td>${kb(r.js.gzip)} <span class="muted">(${r.js.requests})</span></td>
          <td>${kb(r.js.brotli)}</td><td>${kb(r.css.gzip)}</td><td>${kb(r.html.gzip)}</td>
          <td>${r.lighthouse.performance}</td><td>${r.lighthouse.accessibility}</td>
          <td>${Math.round(r.lighthouse.lcpMs)} ms</td><td>${Math.round(r.lighthouse.tbtMs)} ms</td>
          <td>${r.buildSeconds === null ? '–' : `${r.buildSeconds.toFixed(1)} s`}</td>
          <td>${r.loc.lines}</td>
        </tr>`,
        )
        .join('')}</tbody>
    </table></div>
    <p class="muted">
      Measured ${escape(file.generatedAt.slice(0, 10))} with <code>pnpm metrics</code>:
      JS, CSS and HTML are what a fresh browser downloads for <code>/</code> (requests in
      brackets), compressed locally so every server is measured the same way (CSS inlined into the page
      counts as HTML). Lighthouse uses its
      mobile preset and the median of three runs.
    </p>`
}

/** The page body. `urls` holds each deployed app's address, when known. */
export function renderLanding(
  metrics: MetricsFile | null,
  urls: Partial<Record<AppName, string>>,
): string {
  const byApp = new Map(metrics?.results.map((r) => [r.app, r]))
  return `<header class="header"><p class="title">Hacker News, five ways</p></header>
  <main class="main">
    <h1>One Hacker News reader, five frameworks</h1>
    <p class="lede">
      The same pages, markup and features, built with Next.js, Nuxt, SvelteKit, SolidStart and
      Qwik City. Every app passes one shared Playwright suite and reads Hacker News through one
      shared client, so the differences below come from the frameworks.
    </p>
    <section class="cards" aria-label="Apps">
      ${FRAMEWORKS.map((f) => card(f, byApp.get(f.app), urls[f.app])).join('')}
    </section>
    <section aria-labelledby="metrics-heading">
      <h2 id="metrics-heading">Side by side</h2>
      ${metrics ? table(metrics) : '<p>No measurements yet: run <code>pnpm metrics</code>.</p>'}
    </section>
  </main>
  <footer class="footer"><a href="${REPO}">Source on GitHub</a> · MIT licensed</footer>`
}
