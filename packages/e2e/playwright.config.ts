import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import { getApp } from './apps'

const app = getApp()
const root = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
  testDir: 'tests',
  // The apps talk to the live HN API, which is occasionally slow.
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  outputDir: `test-results/${app.name}`,
  use: {
    baseURL: `http://localhost:${app.port}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: app.name, use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `${app.build} && exec ${app.serve}`,
    cwd: `${root}/${app.dir}`,
    port: app.port,
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
})
