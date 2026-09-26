'use client'

import { NAV_TABS, themeCookie, type Theme } from '@repo/hn-core'
import Form from 'next/form'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'
import { APP_NAME } from '@/lib/meta'

const darkQuery = () => matchMedia('(prefers-color-scheme: dark)')

function subscribeToScheme(onChange: () => void) {
  const query = darkQuery()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** The system color scheme, assumed light on the server. */
const useSystemDark = () =>
  useSyncExternalStore(
    subscribeToScheme,
    () => darkQuery().matches,
    () => false,
  )

/** `savedTheme` comes from the theme cookie, read on the server. */
export function Header({ savedTheme }: { savedTheme?: Theme }) {
  const pathname = usePathname()
  const query = useSearchParams().get('q') ?? ''
  const systemDark = useSystemDark()
  const [chosenTheme, setChosenTheme] = useState(savedTheme)
  const theme = chosenTheme ?? (systemDark ? 'dark' : 'light')

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setChosenTheme(next)
    document.documentElement.dataset.theme = next
    document.cookie = themeCookie(next)
  }

  return (
    <header className="header">
      <nav className="navbar" aria-label="Main">
        <Link className="brand" href="/">
          {APP_NAME}
        </Link>
        {NAV_TABS.map((tab) => (
          <Link
            key={tab.type}
            className="navlink"
            href={`/${tab.type}`}
            aria-current={pathname === `/${tab.type}` ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        ))}
        <div className="navbar-actions">
          {/* No prefetch: a prefetched query-less /search would leave its "Search" title behind. */}
          <Form className="search-form" role="search" action="/search" prefetch={false}>
            <input
              key={pathname === '/search' ? query : ''}
              type="search"
              name="q"
              placeholder="Search"
              aria-label="Search stories"
              defaultValue={pathname === '/search' ? query : ''}
            />
          </Form>
          <button className="theme-toggle" type="button" onClick={toggleTheme}>
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            <span className="visually-hidden">
              Switch to {theme === 'dark' ? 'light' : 'dark'} theme
            </span>
          </button>
        </div>
      </nav>
    </header>
  )
}
