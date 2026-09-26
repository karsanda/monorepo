/** Viewer preferences shared by every app: hidden/read stories and the color theme. */

export const HIDDEN_KEY = 'hn:hidden'
export const READ_KEY = 'hn:read'
/** Oldest ids are dropped past this, so storage stays small. */
const MAX_IDS = 2000

/** Ids saved under `key` in localStorage; empty when storage is missing or blocked. */
export function loadIds(key: string): Set<number> {
  try {
    const parsed: unknown = JSON.parse(globalThis.localStorage?.getItem(key) ?? '[]')
    return new Set(Array.isArray(parsed) ? parsed.filter(Number.isInteger) : [])
  } catch {
    return new Set()
  }
}

export function saveIds(key: string, ids: Iterable<number>): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify([...ids].slice(-MAX_IDS)))
  } catch {
    // Private mode or blocked storage: the preference just doesn't persist.
  }
}

export type Theme = 'light' | 'dark'

/** Cookie (not localStorage) so servers can render the chosen theme without a flash. */
export const THEME_COOKIE = 'theme'

export function parseTheme(value: string | null | undefined): Theme | undefined {
  return value === 'light' || value === 'dark' ? value : undefined
}

/** `document.cookie` value that remembers `theme` for a year. */
export function themeCookie(theme: Theme): string {
  return `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`
}

const THEME_IN_COOKIES = new RegExp(`(?:^|;\\s*)${THEME_COOKIE}=([^;]*)`)

/** The saved theme from a raw `Cookie` request header, for servers without a cookie API. */
export function themeFromCookieHeader(header: string | null | undefined): Theme | undefined {
  return parseTheme(THEME_IN_COOKIES.exec(header ?? '')?.[1])
}
