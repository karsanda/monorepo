import { chromium } from '@playwright/test'
import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { medianRun } from './report.ts'
import type { LighthouseScores } from './types.ts'

/** Lighthouse's default (mobile) run, `runs` times against a fresh profile; the median run wins. */
export async function runLighthouse(url: string, runs: number): Promise<LighthouseScores> {
  const chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox'],
  })
  try {
    const results: LighthouseScores[] = []
    for (let i = 0; i < runs; i++) {
      const result = await lighthouse(url, {
        port: chrome.port,
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility'],
      })
      if (!result) throw new Error(`Lighthouse returned nothing for ${url}`)
      const { categories, audits } = result.lhr
      results.push({
        performance: Math.round((categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
        lcpMs: audits['largest-contentful-paint']?.numericValue ?? 0,
        tbtMs: audits['total-blocking-time']?.numericValue ?? 0,
        cls: audits['cumulative-layout-shift']?.numericValue ?? 0,
      })
    }
    return medianRun(results)
  } finally {
    chrome.kill()
  }
}
