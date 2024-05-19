// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface StoryData {
		by: string
		descendants?: number
		id: string
		kids?: number[]
		score: number
		text?: string
		time: number
		title: string
		type: 'story' | 'job'
		url?: string
		dead?: boolean
		deleted?: boolean
	}

	interface CommentData {
		by: string
		id: string
		kids?: number[]
		parent: number
		text: string
		time: number
		type: 'comment'
		dead?: boolean
		deleted?: boolean
	}

	interface UserData {
		id: string
		created: number
		karma: number
		about?: string
		submitted?: string[]
	}
}

export {};
