import { parseTheme, THEME_COOKIE } from '@repo/hn-core'
import type { Handle } from '@sveltejs/kit'

/** Renders the saved theme into `<html data-theme>` so dark mode doesn't flash on load. */
export const handle: Handle = async ({ event, resolve }) => {
  const theme = parseTheme(event.cookies.get(THEME_COOKIE))
  event.locals.theme = theme
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%theme%', theme ?? ''),
  })
}
