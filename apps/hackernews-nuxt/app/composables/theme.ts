import { THEME_COOKIE, parseTheme, type Theme } from '@repo/hn-core'

/**
 * The saved color theme. It lives in a cookie so the server can render `<html data-theme>`
 * and dark mode doesn't flash on load. `undefined` follows the system setting.
 */
export function useTheme() {
  const cookie = useCookie<Theme | undefined>(THEME_COOKIE, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    decode: (value) => parseTheme(value),
    encode: (value) => value ?? '',
  })
  return cookie
}
