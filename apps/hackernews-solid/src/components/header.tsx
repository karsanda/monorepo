import { NAV_TABS, themeCookie, type Theme } from '@repo/hn-core'
import { useLocation, useNavigate } from '@solidjs/router'
import { createSignal, For, onCleanup, onMount } from 'solid-js'
import { APP_NAME } from '~/lib/meta'
import { savedTheme } from '~/lib/theme'

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  const [chosenTheme, setChosenTheme] = createSignal<Theme | undefined>(savedTheme())
  const [systemDark, setSystemDark] = createSignal(false)
  const theme = () => chosenTheme() ?? (systemDark() ? 'dark' : 'light')

  onMount(() => {
    const query = matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(query.matches)
    const onChange = () => setSystemDark(query.matches)
    query.addEventListener('change', onChange)
    onCleanup(() => query.removeEventListener('change', onChange))
  })

  function toggleTheme() {
    const next = theme() === 'dark' ? 'light' : 'dark'
    setChosenTheme(next)
    document.documentElement.dataset.theme = next
    document.cookie = themeCookie(next)
  }

  const query = () => (location.pathname === '/search' ? (location.query.q as string) : '') ?? ''

  function search(event: SubmitEvent) {
    event.preventDefault()
    const q = new FormData(event.currentTarget as HTMLFormElement).get('q')
    navigate(`/search?${new URLSearchParams({ q: String(q ?? '') })}`)
  }

  return (
    <header class="header">
      <nav class="navbar" aria-label="Main">
        <a class="brand" href="/">
          {APP_NAME}
        </a>
        <For each={NAV_TABS}>
          {(tab) => (
            <a
              class="navlink"
              href={`/${tab.type}`}
              aria-current={location.pathname === `/${tab.type}` ? 'page' : undefined}
            >
              {tab.label}
            </a>
          )}
        </For>
        <div class="navbar-actions">
          <form class="search-form" role="search" action="/search" onSubmit={search}>
            <input
              type="search"
              name="q"
              placeholder="Search"
              aria-label="Search stories"
              value={query()}
            />
          </form>
          <button class="theme-toggle" type="button" onClick={toggleTheme}>
            <span aria-hidden="true">{theme() === 'dark' ? '☀' : '☾'}</span>
            <span class="visually-hidden">
              Switch to {theme() === 'dark' ? 'light' : 'dark'} theme
            </span>
          </button>
        </div>
      </nav>
    </header>
  )
}
