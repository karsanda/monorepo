/**
 * Errors thrown from page setup. `fatal` shows the full-screen error page during client-side
 * navigation (server renders always do); Nitro also logs fatal errors, so 404s skip it there.
 */
export const notFound = () =>
  createError({ statusCode: 404, statusMessage: 'Not found', fatal: import.meta.client })

export const upstreamError = () =>
  createError({ statusCode: 502, statusMessage: "Couldn't reach Hacker News", fatal: true })
