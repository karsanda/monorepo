import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city'
import { NAV_TABS, themeCookie, type Theme } from '@repo/hn-core'
import { APP_NAME } from '~/lib/meta'

/** `savedTheme` comes from the theme cookie, read on the server. */
export const Header = component$<{ savedTheme?: Theme }>(({ savedTheme }) => {
  const location = useLocation()
  const nav = useNavigate()
  const chosenTheme = useSignal(savedTheme)
  const systemDark = useSignal(false)
  const theme = chosenTheme.value ?? (systemDark.value ? 'dark' : 'light')

  // Only the browser knows the system color scheme.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const query = matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = query.matches
    const onChange = () => (systemDark.value = query.matches)
    query.addEventListener('change', onChange)
    cleanup(() => query.removeEventListener('change', onChange))
  })

  const toggleTheme = $(() => {
    const next =
      (chosenTheme.value ?? (systemDark.value ? 'dark' : 'light')) === 'dark' ? 'light' : 'dark'
    chosenTheme.value = next
    document.documentElement.dataset.theme = next
    document.cookie = themeCookie(next)
  })

  const pathname = location.url.pathname
  const query = pathname === '/search' ? (location.url.searchParams.get('q') ?? '') : ''

  return (
    <header class="header">
      <nav class="navbar" aria-label="Main">
        <Link class="brand" href="/">
          {APP_NAME}
        </Link>
        {NAV_TABS.map((tab) => (
          <Link
            key={tab.type}
            class="navlink"
            href={`/${tab.type}`}
            aria-current={pathname === `/${tab.type}` ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        ))}
        <div class="navbar-actions">
          <form
            class="search-form"
            role="search"
            action="/search"
            preventdefault:submit
            onSubmit$={(_, form) => {
              const q = new FormData(form).get('q')
              return nav(`/search?${new URLSearchParams({ q: String(q ?? '') })}`)
            }}
          >
            <input
              type="search"
              name="q"
              placeholder="Search"
              aria-label="Search stories"
              value={query}
            />
          </form>
          <button class="theme-toggle" type="button" onClick$={toggleTheme}>
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            <span class="visually-hidden">
              Switch to {theme === 'dark' ? 'light' : 'dark'} theme
            </span>
          </button>
        </div>
      </nav>
    </header>
  )
})
