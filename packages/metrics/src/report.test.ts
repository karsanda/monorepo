import { describe, expect, test } from 'vitest'
import { checkBudgets, medianRun, mergeResults, toMarkdown, updateReadme } from './report.ts'
import type { AppMetrics } from './types.ts'

const bytes = (gzip: number) => ({ raw: gzip * 3, gzip, brotli: gzip - 100, requests: 2 })

const result = (app: AppMetrics['app'], jsGzip: number, accessibility = 100): AppMetrics => ({
  app,
  label: app.toUpperCase(),
  buildSeconds: 12.34,
  js: bytes(jsGzip),
  css: bytes(2048),
  html: bytes(4096),
  lighthouse: { performance: 90, accessibility, lcpMs: 1234.5, tbtMs: 10, cls: 0.0123 },
  loc: { files: 10, lines: 500 },
})

test('the table lists the smallest bundle first', () => {
  const table = toMarkdown({
    generatedAt: '2026-09-26T00:00:00Z',
    node: '24.14.0',
    results: [result('next', 90_000), result('qwik', 2_000)],
  })
  const rows = table
    .split('\n')
    .filter((line) => line.startsWith('| QWIK') || line.startsWith('| NEXT'))
  expect(rows[0]).toMatch(/^\| QWIK \| 2\.0 kB \(2\) \|/)
  expect(rows[1]).toContain('87.9 kB (2)')
  expect(rows[0]).toContain('| 1235 ms | 10 ms | 0.012 | 12.3 s | 500 |')
  expect(table).toContain('Measured 2026-09-26 on Node 24.14.0')
})

describe('budgets', () => {
  test('flags JS over budget and accessibility under the minimum', () => {
    const problems = checkBudgets([result('next', 120 * 1024, 95), result('qwik', 1024)], {
      next: { maxJsGzipKb: 100, minAccessibility: 100 },
      qwik: { maxJsGzipKb: 10, minAccessibility: 100 },
    })
    expect(problems).toEqual([
      'NEXT: 120.0 kB of JS (gzip) is over its 100 kB budget',
      'NEXT: accessibility 95 is under its minimum of 100',
    ])
  })

  test('an app without a budget is a problem', () => {
    expect(checkBudgets([result('solid', 1)], {})).toEqual([
      'SOLID: no budget in metrics/budgets.json',
    ])
  })
})

test('updates only the marked README section', () => {
  const readme = 'intro\n<!-- metrics:start -->\nold\n<!-- metrics:end -->\noutro'
  expect(updateReadme(readme, 'new')).toBe(
    'intro\n<!-- metrics:start -->\n\nnew\n\n<!-- metrics:end -->\noutro',
  )
  expect(() => updateReadme('no markers', 'new')).toThrow(/metrics:start/)
})

test('fresh results replace old ones for the same app', () => {
  const merged = mergeResults([result('next', 1), result('nuxt', 1)], [result('next', 2)])
  expect(merged.map((r) => [r.app, r.js.gzip])).toEqual([
    ['nuxt', 1],
    ['next', 2],
  ])
})

test('picks the median run by performance score', () => {
  const runs = [60, 95, 80].map((performance) => ({ performance, id: performance }))
  expect(medianRun(runs).id).toBe(80)
  expect(() => medianRun([])).toThrow()
})
