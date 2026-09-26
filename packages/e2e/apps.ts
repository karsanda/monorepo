/**
 * How to build and serve each app, shared by the e2e suite and the metrics script. Commands run
 * in the app's directory and call binaries directly (not through pnpm), so whoever started the
 * server can stop it.
 */
export interface AppTarget {
  /** Display name. */
  label: string
  dir: string
  /** Hand-written source, relative to `dir`, for the lines-of-code count. */
  sourceDir: string
  port: number
  build: string
  /** Serves the production build on `port`. */
  serve: string
}

const bin = (cmd: string) => `./node_modules/.bin/${cmd}`

export const APPS = {
  svelte: {
    label: 'SvelteKit',
    dir: 'apps/hackernews-svelte',
    sourceDir: 'src',
    port: 4173,
    build: `${bin('vite')} build`,
    serve: `${bin('vite')} preview --port 4173 --strictPort`,
  },
  next: {
    label: 'Next.js',
    dir: 'apps/hackernews-next',
    sourceDir: 'src',
    port: 3000,
    build: `${bin('next')} build`,
    serve: `${bin('next')} start --port 3000`,
  },
  nuxt: {
    label: 'Nuxt',
    dir: 'apps/hackernews-nuxt',
    sourceDir: 'app',
    port: 3001,
    build: `${bin('nuxt')} build`,
    serve: `env PORT=3001 node .output/server/index.mjs`,
  },
  solid: {
    label: 'SolidStart',
    dir: 'apps/hackernews-solid',
    sourceDir: 'src',
    port: 3002,
    build: `${bin('vite')} build`,
    serve: `env PORT=3002 node .output/server/index.mjs`,
  },
  qwik: {
    label: 'Qwik City',
    dir: 'apps/hackernews-qwik',
    sourceDir: 'src',
    port: 3003,
    // Qwik's production preview (Node); deployments use the Vercel edge build instead.
    build: `${bin('vite')} build && ${bin('vite')} build --ssr src/entry.preview.tsx`,
    serve: `${bin('vite')} preview --port 3003 --strictPort`,
  },
} satisfies Record<string, AppTarget>

export type AppName = keyof typeof APPS

export const APP_NAMES = Object.keys(APPS) as AppName[]

export function isAppName(name: string): name is AppName {
  return name in APPS
}

export function getApp(name = process.env.APP): AppTarget & { name: AppName } {
  if (!name || !isAppName(name)) {
    throw new Error(`Set APP to one of: ${APP_NAMES.join(', ')} (got ${name ?? 'nothing'})`)
  }
  return { name, ...APPS[name] }
}
