import { isLive } from '@repo/hn-core'
import { error } from '@sveltejs/kit'
import { hn } from '$lib/hn'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  if (!/^\d+$/.test(params.id)) error(404, 'Not found')

  const item = await hn.getItem(params.id).catch(() => error(502, "Couldn't reach Hacker News"))
  if (!isLive(item)) error(404, 'Not found')

  // The whole comment tree in one Algolia request, streamed after the story.
  const thread = hn.getThread(params.id).then((comments) => comments ?? [])

  return { item, thread }
}
