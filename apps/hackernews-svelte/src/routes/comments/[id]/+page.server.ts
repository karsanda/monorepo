import type { CommentData, StoryData } from '@repo/hn-core'
import { error } from '@sveltejs/kit'
import { getItem } from '$lib/hn'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, params }) => {
  const story = await getItem<StoryData | CommentData>(fetch, params.id)
  if (!story) error(404, 'Item not found')

  const comments = Promise.all((story.kids ?? []).map((id) => getItem<CommentData>(fetch, id)))

  return { story, comments }
}
