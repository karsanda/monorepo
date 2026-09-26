import type { AppName } from '@repo/e2e/apps'

export interface Bytes {
  raw: number
  gzip: number
  brotli: number
  requests: number
}

export interface LighthouseScores {
  /** 0–100. */
  performance: number
  /** 0–100. */
  accessibility: number
  lcpMs: number
  tbtMs: number
  cls: number
}

export interface AppMetrics {
  app: AppName
  label: string
  buildSeconds: number | null
  /** What the browser downloads to show `/`, service worker blocked. */
  js: Bytes
  css: Bytes
  html: Bytes
  lighthouse: LighthouseScores
  loc: { files: number; lines: number }
}

export interface MetricsFile {
  generatedAt: string
  node: string
  results: AppMetrics[]
}

export interface Budget {
  maxJsGzipKb: number
  minAccessibility: number
}

export type Budgets = Partial<Record<AppName, Budget>>
