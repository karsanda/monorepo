import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, params }) => {
	const res = await fetch(`https://hacker-news.firebaseio.com/v0/user/${params.id}.json`)
	const user = await res.json()

	return { user }
}

async function getSubmissions(itemId: string) {
	const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json`)
	const item = await res.json()
	return item
}
