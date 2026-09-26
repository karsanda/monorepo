import { parseTheme, themeFromCookieHeader, type Theme } from '@repo/hn-core'
import { getRequestEvent, isServer } from 'solid-js/web'

/**
 * The saved theme: from the request's cookie on the server, and from `<html data-theme>`
 * (which the server rendered from that cookie) in the browser, so both agree on hydration.
 */
export function savedTheme(): Theme | undefined {
  return isServer
    ? themeFromCookieHeader(getRequestEvent()?.request.headers.get('cookie'))
    : parseTheme(document.documentElement.dataset.theme)
}
