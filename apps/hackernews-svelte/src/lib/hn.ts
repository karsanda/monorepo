import { createHnClient } from '@repo/hn-core'

/**
 * One client for the whole app. On the server its cache is shared by every request, so popular
 * pages hit the HN API at most once a minute; in the browser it serves "Load more".
 */
export const hn = createHnClient()
