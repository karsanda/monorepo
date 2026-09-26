import { component$, Slot, useContextProvider, useStore, useVisibleTask$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import { parseTheme, THEME_COOKIE } from '@repo/hn-core'
import { Header } from '~/components/header'
import { loadPrefs, PrefsContext, type Prefs } from '~/lib/prefs'

export const useSavedTheme = routeLoader$(({ cookie }) =>
  parseTheme(cookie.get(THEME_COOKIE)?.value),
)

export default component$(() => {
  const savedTheme = useSavedTheme()
  const prefs = useStore<Prefs>({ hidden: [], read: [] })
  useContextProvider(PrefsContext, prefs)

  // localStorage only exists in the browser.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => loadPrefs(prefs))

  return (
    <div class="app">
      <Header savedTheme={savedTheme.value} />
      <main class="main">
        <Slot />
      </main>
      <footer class="footer">
        ©{new Date().getFullYear()} Karsanda ·{' '}
        <a href="https://github.com/karsanda/monorepo/tree/main/apps/hackernews-qwik">Source</a>
      </footer>
    </div>
  )
})
