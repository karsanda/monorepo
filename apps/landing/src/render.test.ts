import type { MetricsFile } from '@repo/metrics/types'
import { expect, test } from 'vitest'
import { renderLanding } from './render.ts'

const bytes = (gzip: number) => ({ raw: gzip * 3, gzip, brotli: gzip, requests: 3 })
const metrics: MetricsFile = {
  generatedAt: '2026-09-26T10:00:00Z',
  node: '24.14.0',
  results: (['next', 'qwik'] as const).map((app, i) => ({
    app,
    label: app === 'next' ? 'Next.js' : 'Qwik City',
    buildSeconds: 3,
    js: bytes((i + 1) * 10_240),
    css: bytes(1024),
    html: bytes(2048),
    lighthouse: { performance: 99, accessibility: 100, lcpMs: 1500, tbtMs: 0, cls: 0 },
    loc: { files: 20, lines: 700 },
  })),
}

test('shows a card per framework with its numbers and links', () => {
  const html = renderLanding(metrics, { next: 'https://next.example.com' })
  for (const name of ['Next.js', 'Nuxt', 'SvelteKit', 'SolidStart', 'Qwik City']) {
    expect(html).toContain(`<h2>${name}</h2>`)
  }
  expect(html).toContain('<a href="https://next.example.com">Open the app</a>')
  expect(html).toContain('/tree/main/apps/hackernews-qwik">Source</a>')
  expect(html.match(/Open the app/g)).toHaveLength(1)
  expect(html).toContain('<dd>10.0 kB</dd>')
})

test('lists the measured apps smallest JS first', () => {
  const html = renderLanding(metrics, {})
  expect(html.indexOf('<th scope="row">Next.js')).toBeLessThan(
    html.indexOf('<th scope="row">Qwik City'),
  )
  expect(html).toContain('Measured 2026-09-26')
})

test('works before anything has been measured', () => {
  expect(renderLanding(null, {})).toContain('No measurements yet')
})
