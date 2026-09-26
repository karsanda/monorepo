import { parseTheme, THEME_COOKIE } from '@repo/hn-core'
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import type { ReactNode } from 'react'
import { Header } from '@/components/header'
import { SwRegister } from '@/components/sw-register'
import { APP_NAME } from '@/lib/meta'
import './globals.css'

export const metadata: Metadata = {
  title: { template: `%s | ${APP_NAME}`, default: APP_NAME },
  description: 'Hacker News reader built with Next.js',
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = { themeColor: '#0070f3' }

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Rendering the saved theme on the server means dark mode doesn't flash on load.
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value)

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <div className="app">
          <Header savedTheme={theme} />
          <main className="main">{children}</main>
          <footer className="footer">
            ©{new Date().getFullYear()} Karsanda ·{' '}
            <a href="https://github.com/karsanda/monorepo/tree/main/apps/hackernews-next">Source</a>
          </footer>
        </div>
        <SwRegister />
      </body>
    </html>
  )
}
