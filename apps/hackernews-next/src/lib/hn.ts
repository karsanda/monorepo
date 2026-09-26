import { createHnClient } from '@repo/hn-core'

/**
 * Shared HN client. On the server, Next's data cache keeps each response for a minute, so
 * repeat visits across requests don't refetch; browsers ignore the `next` option.
 */
export const hn = createHnClient({
  fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
})
