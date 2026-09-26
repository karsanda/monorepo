import type { AppName } from '@repo/e2e/apps'

export const REPO = 'https://github.com/karsanda/monorepo'

export interface Framework {
  app: AppName
  name: string
  /** The app's `--brand` color. */
  brand: string
  summary: string
}

/** In the order the apps were built. */
export const FRAMEWORKS: Framework[] = [
  {
    app: 'svelte',
    name: 'SvelteKit',
    brand: '#ff3e00',
    summary:
      'The reference app. Svelte 5 runes, server loads that stream story lists and comment threads into {#await} blocks, and SvelteKit’s built-in service worker for offline use.',
  },
  {
    app: 'next',
    name: 'Next.js',
    brand: '#0070f3',
    summary:
      'App Router with React Server Components: pages and the whole comment tree render on the server, Suspense streams the slow parts, and only the toggles, hide/read state and “Load more” ship as client components.',
  },
  {
    app: 'nuxt',
    name: 'Nuxt',
    brand: '#00dc82',
    summary:
      'Vue single-file components with useAsyncData: fully server-rendered on the first visit, skeletons on client-side navigation, useCookie for the theme and createError for 404s.',
  },
  {
    app: 'solid',
    name: 'SolidStart',
    brand: '#76b3e1',
    summary:
      'Fine-grained signals with Solid Router queries. Lists stream through Suspense, while items and users hold the stream (deferStream) so a missing one still answers 404.',
  },
  {
    app: 'qwik',
    name: 'Qwik City',
    brand: '#ac7ef4',
    summary:
      'Resumable instead of hydrated: every page loads in a routeLoader$ on the server, and component code only downloads when you interact with it. Deployed to Vercel’s edge runtime.',
  },
]

/** Environment variable holding an app's deployed URL, e.g. LANDING_URL_NEXT. */
export const urlVariable = (app: AppName) => `LANDING_URL_${app.toUpperCase()}`
