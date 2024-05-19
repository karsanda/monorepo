import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, params }) => {
	const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${params.id}.json`)
	const story = await res.json()

  const comments = Promise.all(story.kids.map(getComment))

  return { story, comments }
}

async function getComment(commentId: string) {
	const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`)
	const story = await res.json()
	return story
}
