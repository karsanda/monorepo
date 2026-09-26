/**
 * Writes an app's icons (SVG favicon plus PNGs for the web app manifest) in its brand color.
 * Rendering uses Playwright's Chromium, since the repo has no image tooling:
 *
 *   pnpm --filter @repo/e2e exec node ../../scripts/generate-icons.ts <out-dir> <brand-color>
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'

const [outArg, brand] = process.argv.slice(2)
if (!outArg || !brand) throw new Error('usage: generate-icons.ts <out-dir> <brand-color>')
// Relative to the repo root, wherever the script is run from.
const out = resolve(import.meta.dirname, '..', outArg)

// Resolved from the package the script runs in (@repo/e2e), which has Playwright.
const { chromium } = createRequire(join(process.cwd(), 'package.json'))(
  '@playwright/test',
) as typeof import('@playwright/test')

const svg = (rounded: boolean) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rounded ? 96 : 0}" fill="${brand}"/>
  <text x="256" y="336" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
    font-size="240" font-weight="700" fill="#ffffff">HN</text>
</svg>
`

mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'favicon.svg'), svg(true))

const browser = await chromium.launch()
const page = await browser.newPage()
for (const [name, size, rounded] of [
  ['icon-192.png', 192, true],
  ['icon-512.png', 512, true],
  // Maskable icons fill the whole square; the OS applies its own mask.
  ['icon-maskable-512.png', 512, false],
  ['apple-touch-icon.png', 180, false],
] as const) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<style>*{margin:0}svg{display:block;width:100vw;height:100vh}</style>${svg(rounded)}`,
  )
  await page.screenshot({ path: join(out, name), omitBackground: true })
}
await browser.close()
console.log(`Wrote icons to ${out}`)
