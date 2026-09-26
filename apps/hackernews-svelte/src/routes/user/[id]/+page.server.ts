import { error } from '@sveltejs/kit'
import { hn } from '$lib/hn'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const [user, stories] = await Promise.all([
    hn.getUser(params.id),
    hn.getUserStories(params.id),
  ]).catch(() => error(502, "Couldn't reach Hacker News"))
  if (!user) error(404, 'Not found')

  return { user, stories }
}
