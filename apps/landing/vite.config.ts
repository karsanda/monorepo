import { APP_NAMES } from '@repo/e2e/apps'
import type { MetricsFile } from '@repo/metrics/types'
import { existsSync, readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import { urlVariable } from './src/content.ts'
import { renderLanding } from './src/render.ts'

const METRICS = new URL('../../metrics/metrics.json', import.meta.url)

/**
 * Renders the page into index.html at build time, so the landing page ships no JavaScript.
 * Numbers come from metrics/metrics.json; app links from LANDING_URL_<APP> variables.
 */
function landing(): Plugin {
  return {
    name: 'landing',
    configureServer(server) {
      server.watcher.add(METRICS.pathname)
    },
    transformIndexHtml(html) {
      const metrics: MetricsFile | null = existsSync(METRICS)
        ? JSON.parse(readFileSync(METRICS, 'utf8'))
        : null
      const urls = Object.fromEntries(
        APP_NAMES.map((app) => [app, process.env[urlVariable(app)]]).filter(([, url]) => url),
      )
      return html.replace('<!--landing-->', renderLanding(metrics, urls))
    },
  }
}

export default defineConfig({ plugins: [landing()] })
