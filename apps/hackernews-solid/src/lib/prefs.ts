import { HIDDEN_KEY, loadIds, READ_KEY, saveIds } from '@repo/hn-core'
import { createSignal } from 'solid-js'

/**
 * Hidden and read stories, kept in localStorage. Starts empty (as on the server) and fills in
 * once `load()` runs in the browser, so hydration matches the server-rendered HTML.
 */
function idSet(key: string) {
  const [ids, setIds] = createSignal<ReadonlySet<number>>(new Set())
  return {
    has: (id: number) => ids().has(id),
    load: () => setIds(loadIds(key)),
    add(id: number) {
      const next = new Set(ids()).add(id)
      setIds(next)
      saveIds(key, next)
    },
  }
}

export const hidden = idSet(HIDDEN_KEY)
export const read = idSet(READ_KEY)
