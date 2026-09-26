import { component$, Slot, useContextProvider, useStore } from '@builder.io/qwik'
import { QwikCityMockProvider } from '@builder.io/qwik-city'
import { createDOM } from '@builder.io/qwik/testing'
import type { JSXOutput } from '@builder.io/qwik'
import { PrefsContext, type Prefs } from '~/lib/prefs'

const Providers = component$(() => {
  useContextProvider(PrefsContext, useStore<Prefs>({ hidden: [], read: [] }))
  return <Slot />
})

/** Renders `jsx` with the app's context (router + prefs) and returns the testing helpers. */
export async function renderApp(jsx: JSXOutput) {
  const dom = await createDOM()
  await dom.render(
    <QwikCityMockProvider>
      <Providers>{jsx}</Providers>
    </QwikCityMockProvider>,
  )
  return dom
}
