import {
  getPage,
  HOME_STORY_TYPE,
  isLive,
  pageCount,
  paginateData,
  type StoryData,
} from '@repo/hn-core'
import { error } from '@sveltejs/kit'
import { hn } from '$lib/hn'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, params }) => {
  const type = params.slug ?? HOME_STORY_TYPE
  const page = getPage(url.searchParams.get('page'))

  const ids = await hn.getIds(type).catch(() => error(502, "Couldn't reach Hacker News"))

  return {
    type,
    page,
    pageCount: pageCount(ids.length),
    // Streamed: the page shell renders while the 30 items load.
    stories: hn
      .getItems<StoryData>(paginateData(ids, page))
      .then((items) => items.filter((item) => isLive(item))),
  }
}
