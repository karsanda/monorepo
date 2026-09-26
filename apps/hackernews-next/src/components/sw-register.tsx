'use client'

import { useEffect } from 'react'

/** Registers `public/sw.js` in production builds, so visited pages open offline. */
export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  return null
}
