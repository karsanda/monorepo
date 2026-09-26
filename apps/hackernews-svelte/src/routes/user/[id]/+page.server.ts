import { userURI, type UserData } from '@repo/hn-core'
import { error } from '@sveltejs/kit'
import { getJSON } from '$lib/hn'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, params }) => {
  const user = await getJSON<UserData>(fetch, userURI(params.id))
  if (!user) error(404, 'User not found')

  return { user }
}
