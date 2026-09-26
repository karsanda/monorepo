import type { AppMetrics, Budgets, MetricsFile } from './types.ts'

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} kB`
const ms = (value: number) => `${Math.round(value)} ms`

/** Markdown table of every app, smallest JS first. */
export function toMarkdown(file: MetricsFile): string {
  const rows = [...file.results].sort((a, b) => a.js.gzip - b.js.gzip)
  const lines = [
    '| App | JS (gzip) | JS (brotli) | CSS (gzip) | HTML (gzip) | Performance | Accessibility | LCP | TBT | CLS | Build | Lines of code |',
    '| --- | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |',
    ...rows
      .map((r) =>
        [
          r.label,
          `${kb(r.js.gzip)} (${r.js.requests})`,
          kb(r.js.brotli),
          kb(r.css.gzip),
          kb(r.html.gzip),
          r.lighthouse.performance,
          r.lighthouse.accessibility,
          ms(r.lighthouse.lcpMs),
          ms(r.lighthouse.tbtMs),
          r.lighthouse.cls.toFixed(3),
          r.buildSeconds === null ? '–' : `${r.buildSeconds.toFixed(1)} s`,
          r.loc.lines,
        ].join(' | '),
      )
      .map((row) => `| ${row} |`),
  ]
  return [
    ...lines,
    '',
    `JS is what the browser downloads to show \`/\` (requests in brackets), compressed locally so every server is measured the same way; CSS inlined into the page counts as HTML. Lighthouse: mobile preset, median of runs. Measured ${file.generatedAt.slice(0, 10)} on Node ${file.node}.`,
  ].join('\n')
}

/** Budget violations, one message each; empty when every app is within budget. */
export function checkBudgets(results: AppMetrics[], budgets: Budgets): string[] {
  const problems: string[] = []
  for (const r of results) {
    const budget = budgets[r.app]
    if (!budget) {
      problems.push(`${r.label}: no budget in metrics/budgets.json`)
      continue
    }
    const jsKb = r.js.gzip / 1024
    if (jsKb > budget.maxJsGzipKb) {
      problems.push(
        `${r.label}: ${jsKb.toFixed(1)} kB of JS (gzip) is over its ${budget.maxJsGzipKb} kB budget`,
      )
    }
    if (r.lighthouse.accessibility < budget.minAccessibility) {
      problems.push(
        `${r.label}: accessibility ${r.lighthouse.accessibility} is under its minimum of ${budget.minAccessibility}`,
      )
    }
  }
  return problems
}

/** Replaces what's between the metrics markers in `readme`. */
export function updateReadme(readme: string, table: string): string {
  const start = '<!-- metrics:start -->'
  const end = '<!-- metrics:end -->'
  const from = readme.indexOf(start)
  const to = readme.indexOf(end)
  if (from === -1 || to < from) throw new Error(`README has no ${start} … ${end} section`)
  return `${readme.slice(0, from + start.length)}\n\n${table}\n\n${readme.slice(to)}`
}

/** Replaces results for the apps that were measured, keeping the rest. */
export function mergeResults(previous: AppMetrics[], fresh: AppMetrics[]): AppMetrics[] {
  const measured = new Set(fresh.map((r) => r.app))
  return [...previous.filter((r) => !measured.has(r.app)), ...fresh]
}

/** The run with the median performance score, so all its numbers come from one real load. */
export function medianRun<T extends { performance: number }>(runs: T[]): T {
  if (!runs.length) throw new Error('No Lighthouse runs')
  return [...runs].sort((a, b) => a.performance - b.performance)[Math.floor(runs.length / 2)]!
}
