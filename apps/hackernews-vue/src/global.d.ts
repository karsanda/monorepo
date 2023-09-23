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
