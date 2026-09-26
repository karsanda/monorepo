// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server'
import { savedTheme } from './lib/theme'

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      // The saved theme is rendered on the server, so dark mode doesn't flash on load.
      <html lang="en" data-theme={savedTheme()}>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Hacker News reader built with SolidStart" />
          <meta name="theme-color" content="#76b3e1" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
))
