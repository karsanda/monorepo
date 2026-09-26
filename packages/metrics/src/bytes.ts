import { chromium } from '@playwright/test'
import { brotliCompressSync, gzipSync } from 'node:zlib'
import type { Bytes } from './types.ts'

type Kind = 'js' | 'css' | 'html'

const KINDS: Record<string, Kind> = { script: 'js', stylesheet: 'css', document: 'html' }

const empty = (): Bytes => ({ raw: 0, gzip: 0, brotli: 0, requests: 0 })

/** Adds one downloaded file, compressed here so every server's settings are ignored. */
export function addFile(total: Bytes, body: Buffer): void {
  total.raw += body.length
  total.gzip += gzipSync(body, { level: 9 }).length
  total.brotli += brotliCompressSync(body).length
  total.requests++
}

/**
 * Loads `url` in a fresh browser (no cache, service workers blocked) and totals the scripts,
 * stylesheets and documents it downloads until the network goes quiet.
 */
export async function measureBytes(url: string): Promise<Record<Kind, Bytes>> {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' })
    const page = await context.newPage()
    const totals = { js: empty(), css: empty(), html: empty() }
    const pending: Promise<void>[] = []

    page.on('response', (response) => {
      const kind = KINDS[response.request().resourceType()]
      if (!kind || response.status() >= 300) return
      pending.push(
        response.body().then(
          (body) => addFile(totals[kind], body),
          () => {}, // e.g. the page navigated away; nothing to count
        ),
      )
    })

    await page.goto(url, { waitUntil: 'networkidle' })
    await Promise.all(pending)
    return totals
  } finally {
    await browser.close()
  }
}
