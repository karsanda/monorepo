export const APP_NAME = 'Hacker News - Solid'

/** Document title for a page, e.g. "Best stories | Hacker News - Solid". */
export const pageTitle = (page: string) => `${page} | ${APP_NAME}`

/** `?name=` value from Solid's search params, ignoring repeated keys. */
export const param = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : undefined
