// @refresh reload
import { mount, StartClient } from '@solidjs/start/client'

mount(() => <StartClient />, document.getElementById('app')!)

// Offline support for visited pages, in production builds only.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}
