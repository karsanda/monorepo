import { HIDDEN_KEY, loadIds, READ_KEY, saveIds } from '@repo/hn-core'
import { reactive } from 'vue'

/**
 * Hidden and read stories, kept in localStorage. Only ever filled in the browser (by
 * `loadPrefs()` once the app mounts), so server renders and hydration always start empty.
 */
const hidden = reactive(new Set<number>())
const read = reactive(new Set<number>())

export function loadPrefs() {
  for (const id of loadIds(HIDDEN_KEY)) hidden.add(id)
  for (const id of loadIds(READ_KEY)) read.add(id)
}

export function usePrefs() {
  return {
    hidden,
    read,
    hide(id: number) {
      hidden.add(id)
      saveIds(HIDDEN_KEY, hidden)
    },
    markRead(id: number) {
      read.add(id)
      saveIds(READ_KEY, read)
    },
  }
}
