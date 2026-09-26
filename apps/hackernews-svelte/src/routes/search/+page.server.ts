import { getPage } from '@repo/hn-core'
import { error } from '@sveltejs/kit'
import { hn } from '$lib/hn'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() ?? ''
  const page = getPage(url.searchParams.get('page'))
  if (!query) return { query, results: null }

  const results = await hn.search(query, page).catch(() => error(502, "Couldn't reach search"))
  return { query, results }
}
