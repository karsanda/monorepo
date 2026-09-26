import { HIDDEN_KEY, loadIds, READ_KEY, saveIds } from '@repo/hn-core'
import { useSyncExternalStore } from 'react'

const NONE: ReadonlySet<number> = new Set()

/**
 * A set of story ids kept in localStorage. The server snapshot is empty, so hydration matches
 * the server-rendered HTML and the saved ids apply right after.
 */
function idStore(key: string) {
  let ids: ReadonlySet<number> | undefined
  const listeners = new Set<() => void>()
  const get = () => (ids ??= loadIds(key))

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => void listeners.delete(listener)
    },
    get,
    getServer: () => NONE,
    add(id: number) {
      if (get().has(id)) return
      ids = new Set(get()).add(id)
      saveIds(key, ids)
      for (const listener of listeners) listener()
    },
  }
}

export const hidden = idStore(HIDDEN_KEY)
export const read = idStore(READ_KEY)

export function useIds(store: typeof hidden): ReadonlySet<number> {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer)
}
