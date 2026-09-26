import { createContextId } from '@builder.io/qwik'
import { HIDDEN_KEY, loadIds, READ_KEY, saveIds } from '@repo/hn-core'

/**
 * Hidden and read stories, kept in localStorage. The layout provides an empty store (as on the
 * server) and fills it once the page is visible in the browser, so resuming matches the HTML.
 */
export interface Prefs {
  hidden: number[]
  read: number[]
}

export const PrefsContext = createContextId<Prefs>('hn.prefs')

export function loadPrefs(prefs: Prefs) {
  prefs.hidden = [...loadIds(HIDDEN_KEY)]
  prefs.read = [...loadIds(READ_KEY)]
}

export function hide(prefs: Prefs, id: number) {
  if (prefs.hidden.includes(id)) return
  prefs.hidden = [...prefs.hidden, id]
  saveIds(HIDDEN_KEY, prefs.hidden)
}

export function markRead(prefs: Prefs, id: number) {
  if (prefs.read.includes(id)) return
  prefs.read = [...prefs.read, id]
  saveIds(READ_KEY, prefs.read)
}
