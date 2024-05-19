import type { PageServerLoad } from './$types'
import { PAGE_SIZE, getPage, paginateData } from '$lib/pagination'

export const load: PageServerLoad = async ({ fetch, url, params }) => {
  const page = getPage(url.searchParams)
	const slug = params.slug

	const res = await fetch(`https://hacker-news.firebaseio.com/v0/${slug}.json`)
	const data = await res.json()

  const paginatedList = paginateData(data, page)
	const stories = Promise.all(paginatedList.map(getStory))

  return {
		stories,
		slug,
		pagination: {
			page,
			prev: page > 1,
			next: page < Math.ceil(data.length / PAGE_SIZE)
		}
	}
}

async function getStory(storyId: string) {
	const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
	const story = await res.json()
	return story
}
