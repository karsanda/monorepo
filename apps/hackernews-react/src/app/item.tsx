import { formatDistance } from 'date-fns'
import styled from '@emotion/styled'
import useFetch from '../hooks/useFetch'

interface ItemProps {
  id: string;
  index: number;
}

interface ItemData {
  id: number;
  title: string;
  time: number;
  url: string;
  type: string;
  by: string;
  score: number;
}

const Container = styled.article`
  display: flex;
  color: var(--gray);

  & + & {
    margin-top: 10px;
  }
`

const Link = styled.a`
  &:hover {
    color: var(--secondary-color);
  }
`

const Numbering = styled.div`
  width: 20px;
  margin-right: 5px;
  text-align: right;
`

const Title = styled.h4`
  display: inline;
  color: var(--secondary-color);
  font-weight: 400;
  line-height: 1.25em;
`

const Subtitle = styled.p`
  margin-top: 5px;
  color: var(--gray);
  font-size: 0.8em;
`

const Content = styled.div`
  width: calc(100% - 25px);
`

function Item({ id, index }: ItemProps) {
  const { data } = useFetch<ItemData>(`item/${id}`)
  const { url, title, score, by, time } = data || {}
  return (
    <Container>
      <Numbering>{`${index}.`}</Numbering>
      <Content>
        {url ? (
          <Link href={url} target="_blank" rel="noreferrer">
            <Title>{title}</Title>
          </Link>
        ) : <Title>{title}</Title>}
        <Subtitle>
          {score} points by <b>{by}</b>{' '}
          {time && formatDistance(time * 1000, new Date(), { addSuffix: true })}
        </Subtitle>
      </Content>
    </Container>
  )
}

export default Item
