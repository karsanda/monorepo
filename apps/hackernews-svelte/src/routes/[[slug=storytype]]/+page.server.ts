import { getPage, pageCount, paginateData, typeURI, type StoryData, type StoryType } from '@repo/hn-core'
import { getItem, getJSON } from '$lib/hn'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, url, params }) => {
  const slug = (params.slug ?? 'topstories') as StoryType
  const page = getPage(url.searchParams.get('page'))

  const ids = (await getJSON<number[]>(fetch, typeURI(slug))) ?? []
  const stories = Promise.all(paginateData(ids, page).map((id) => getItem<StoryData>(fetch, id)))

  return {
    slug,
    stories,
    pagination: {
      page,
      prev: page > 1,
      next: page < pageCount(ids.length),
    },
  }
}
