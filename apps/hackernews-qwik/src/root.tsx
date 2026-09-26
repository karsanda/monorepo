import { component$ } from '@builder.io/qwik'
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city'
import '@repo/hn-styles/index.css'
import { RouterHead } from './components/router-head'
import './global.css'

// Offline support for visited pages, in production builds only.
const REGISTER_SW = `'serviceWorker' in navigator && navigator.serviceWorker.register('/sw.js')`

export default component$(() => (
  <QwikCityProvider>
    <head>
      <meta charset="utf-8" />
      <RouterHead />
    </head>
    <body>
      <RouterOutlet />
      {import.meta.env.PROD && <script dangerouslySetInnerHTML={REGISTER_SW} />}
    </body>
  </QwikCityProvider>
))
