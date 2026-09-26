import { createHnClient } from '@repo/hn-core'

/**
 * Shared HN client. On the server it lives as long as the process, so its one-minute cache is
 * shared across requests; in the browser it serves client-side navigations.
 */
export const hn = createHnClient()
