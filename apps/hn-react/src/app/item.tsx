import { formatDistance } from 'date-fns'
import styled from '@emotion/styled'
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

const Container = styled.li`
  & + & {
    margin-top: 10px;
  }
`

const Title = styled.h4`
  color: var(--secondary-color);
  font-weight: 400;
`

const Subtitle = styled.p`
  margin-top: 5px;
  color: var(--gray);
  font-size: 0.8em;
`

function Item({ id }: ItemProps) {
  const { data } = useFetch<ItemData>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  const { url, title, score, by, time } =  data || {} 
  return (
    <Container>
      <article>
        <a href={url} target='_blank' rel="noreferrer">
          <Title>{title}</Title>
        </a>
        <Subtitle>
          {score} points by <b>{by}</b> {time && formatDistance(time * 1000, new Date(), { addSuffix: true })}
        </Subtitle>
      </article>
    </Container>
  )
} 

export default Item
