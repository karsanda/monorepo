import { HIDDEN_KEY, loadIds, READ_KEY, saveIds } from '@repo/hn-core'
import { SvelteSet } from 'svelte/reactivity'

/**
 * Hidden and read stories, kept in localStorage. Starts empty (as on the server) and fills in
 * once `load()` runs in the browser, so hydration matches the server-rendered HTML.
 */
class Prefs {
  hidden = new SvelteSet<number>()
  read = new SvelteSet<number>()

  load() {
    for (const id of loadIds(HIDDEN_KEY)) this.hidden.add(id)
    for (const id of loadIds(READ_KEY)) this.read.add(id)
  }

  hide(id: number) {
    this.hidden.add(id)
    saveIds(HIDDEN_KEY, this.hidden)
  }

  markRead(id: number) {
    this.read.add(id)
    saveIds(READ_KEY, this.read)
  }
}

export const prefs = new Prefs()
