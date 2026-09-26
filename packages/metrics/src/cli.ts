/**
 * pnpm metrics [--apps next,qwik] [--skip-build] [--runs 3] [--check] [--readme] [--report-only]
 *
 * Builds and serves each app's production build, then records build time, the JS/CSS/HTML
 * downloaded for `/`, Lighthouse scores and lines of code into metrics/metrics.json and
 * metrics/metrics.md. `--check` fails when an app is over its metrics/budgets.json budget;
 * `--readme` copies the table into the root README; `--report-only` skips measuring and just
 * rewrites the table (and README) from the existing metrics.json.
 */
import { APP_NAMES, APPS, isAppName, type AppName } from '@repo/e2e/apps'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { measureBytes } from './bytes.ts'
import { runLighthouse } from './lighthouse.ts'
import { countLines } from './loc.ts'
import { checkBudgets, mergeResults, toMarkdown, updateReadme } from './report.ts'
import { startServer, timeCommand } from './server.ts'
import type { AppMetrics, Budgets, MetricsFile } from './types.ts'

const root = new URL('../../..', import.meta.url).pathname
const out = join(root, 'metrics')

const { values } = parseArgs({
  options: {
    apps: { type: 'string' },
    'skip-build': { type: 'boolean', default: false },
    runs: { type: 'string', default: '3' },
    check: { type: 'boolean', default: false },
    readme: { type: 'boolean', default: false },
    'report-only': { type: 'boolean', default: false },
  },
})

const apps = values.apps ? values.apps.split(',') : APP_NAMES
const unknown = apps.filter((name) => !isAppName(name))
if (unknown.length) throw new Error(`Unknown apps: ${unknown.join(', ')} (have ${APP_NAMES})`)
const runs = Number(values.runs)

async function measure(name: AppName): Promise<AppMetrics> {
  const app = APPS[name]
  const dir = join(root, app.dir)
  const url = `http://localhost:${app.port}/`

  console.log(`\n▶ ${app.label}`)
  const buildSeconds = values['skip-build'] ? null : timeCommand(app.build, dir)
  const stop = await startServer(app.serve, dir, url)
  try {
    // One warm-up request, so the first measured load doesn't pay for cold server caches.
    await fetch(url)
    const bytes = await measureBytes(url)
    const lighthouse = await runLighthouse(url, runs)
    const loc = await countLines(join(dir, app.sourceDir))
    const result = { app: name, label: app.label, buildSeconds, ...bytes, lighthouse, loc }
    console.log(
      `  JS ${(bytes.js.gzip / 1024).toFixed(1)} kB gzip · performance ${lighthouse.performance} · accessibility ${lighthouse.accessibility} · ${loc.lines} lines`,
    )
    return result
  } finally {
    stop()
  }
}

const fresh: AppMetrics[] = []
if (!values['report-only']) {
  for (const name of apps as AppName[]) fresh.push(await measure(name))
}

const jsonPath = join(out, 'metrics.json')
const previous: MetricsFile | null = existsSync(jsonPath)
  ? JSON.parse(await readFile(jsonPath, 'utf8'))
  : null
const file: MetricsFile = {
  generatedAt: fresh.length || !previous ? new Date().toISOString() : previous.generatedAt,
  node: process.versions.node,
  results: mergeResults(previous?.results ?? [], fresh).sort(
    (a, b) => APP_NAMES.indexOf(a.app) - APP_NAMES.indexOf(b.app),
  ),
}
const table = toMarkdown(file)
await writeFile(jsonPath, `${JSON.stringify(file, null, 2)}\n`)
await writeFile(join(out, 'metrics.md'), `${table}\n`)
console.log(`\n${table}\n`)

const written = [jsonPath, join(out, 'metrics.md')]
if (values.readme) {
  const readmePath = join(root, 'README.md')
  await writeFile(readmePath, updateReadme(await readFile(readmePath, 'utf8'), table))
  written.push(readmePath)
  console.log('Updated the README table.')
}
// Match the repo's formatting, so a metrics run never fails `pnpm format:check`.
spawnSync('pnpm', ['exec', 'prettier', '--write', '--log-level', 'warn', ...written], {
  cwd: root,
  stdio: 'inherit',
})

if (values.check) {
  const budgets: Budgets = JSON.parse(await readFile(join(out, 'budgets.json'), 'utf8'))
  const problems = checkBudgets(fresh, budgets)
  if (problems.length) {
    console.error(`Over budget:\n${problems.map((p) => `  - ${p}`).join('\n')}`)
    process.exitCode = 1
  } else {
    console.log('Every app is within its budget.')
  }
}
