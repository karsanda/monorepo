/**
 * How to build and serve each app for the suite. Commands run in the app's directory and call
 * binaries directly (not through pnpm) so Playwright can stop the server when it's done.
 */
export interface AppTarget {
  dir: string
  port: number
  command: string
}

const bin = (cmd: string) => `./node_modules/.bin/${cmd}`

export const APPS = {
  svelte: {
    dir: 'apps/hackernews-svelte',
    port: 4173,
    command: `${bin('vite')} build && exec ${bin('vite')} preview --port 4173 --strictPort`,
  },
  next: {
    dir: 'apps/hackernews-next',
    port: 3000,
    command: `${bin('next')} build && exec ${bin('next')} start --port 3000`,
  },
  nuxt: {
    dir: 'apps/hackernews-nuxt',
    port: 3001,
    command: `${bin('nuxt')} build && PORT=3001 exec node .output/server/index.mjs`,
  },
} satisfies Record<string, AppTarget>

export type AppName = keyof typeof APPS

export function getApp(name = process.env.APP): AppTarget & { name: AppName } {
  if (!name || !(name in APPS)) {
    throw new Error(`Set APP to one of: ${Object.keys(APPS).join(', ')} (got ${name ?? 'nothing'})`)
  }
  return { name: name as AppName, ...APPS[name as AppName] }
}
