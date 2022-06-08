interface ItemData {
  id: string
  title: string
  time: number
  url?: string
  type: string
  by: string
  score: number
  descendants: number
  text?: string
  dead?: boolean
  deleted?: boolean
  kids?: number[]
}
