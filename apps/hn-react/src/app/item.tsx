import { Suspense } from "react"
import { formatDistance } from "date-fns"
import useFetch from "../hooks/useFetch"

interface ItemProps {
  id: string 
}

interface ItemData {
  id: number
  title: string
  time: number 
  url: string
  type: string
  by: string
  score: number
}

function Item({ id }: ItemProps) {
  const { data } = useFetch<ItemData>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  const { url, title, score, by, time } =  data || {} 
  return (
    <li>
      <Suspense fallback={<article>Loading...</article>}>
        <article>
          <a href={url} target='_blank' rel="noreferrer">
            <h4>{title}</h4>
          </a>
          <p>
            {score} points by <b>{by}</b> {time && formatDistance(time * 1000, new Date(), { addSuffix: true })}
          </p>
        </article>
      </Suspense>
    </li>
  )
} 

export default Item
