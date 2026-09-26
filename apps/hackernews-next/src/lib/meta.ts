export const APP_NAME = 'Hacker News - Next'

/** `?name=` value from Next's `searchParams`, ignoring repeated keys. */
export const param = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : undefined
