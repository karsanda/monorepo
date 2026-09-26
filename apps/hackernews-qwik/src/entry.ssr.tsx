import { renderToStream, type RenderToStreamOptions } from '@builder.io/qwik/server'
import { manifest } from '@qwik-client-manifest'
import { themeFromCookieHeader } from '@repo/hn-core'
import Root from './root'

export default function (opts: RenderToStreamOptions) {
  // The saved theme is rendered on the server, so dark mode doesn't flash on load.
  const theme = themeFromCookieHeader(opts.serverData?.requestHeaders?.cookie)
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    containerAttributes: {
      lang: 'en',
      ...(theme && { 'data-theme': theme }),
      ...opts.containerAttributes,
    },
  })
}
