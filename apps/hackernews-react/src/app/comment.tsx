import styled from '@emotion/styled'
import { formatDistance } from 'date-fns'
import { useState } from 'react'
import useFetch from '../hooks/useFetch'

const Container = styled.article`
  margin-right: 10px;

  & + & {
    margin-top: 15px;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
`

const CollapsibleButton = styled.button`
  font-size: 12px;
  background: none;
  outline: none;
  border: none;
  margin: 0 5px 0 0;
  padding: 0;
  cursor: pointer;
`

const Article = styled.p`
  margin: 5px 0;
  color: var(--gray);
  font-size: 11px;
`

const Content = styled.div`
  margin-left: 17px;
  font-size: 12px;

  & p {
    margin: 10px 0;
  }

  & code, & pre {
    white-space: pre-wrap;
  }
`

const Child = styled.div`
  margin-left: 25px;
`

interface CommentData {
  by: string;
  kids: number[];
  text: string;
  time: number;
}

function Comment({ id }: { id: number }) {
  const { data } = useFetch<CommentData>(`item/${id}`)
  const [ isCollapse, setIsCollapse ] = useState(false)

  if (!data) return null
  const { by, time, kids, text } = data

  return (
    <Container>
      <Header>
        <CollapsibleButton onClick={() => setIsCollapse(!isCollapse)}>
          {isCollapse ? '▼' : '▲'}
        </CollapsibleButton>
        <Article>
          {by} {time && formatDistance(time * 1000, new Date(), { addSuffix: true })}
        </Article>
      </Header>
      <Content dangerouslySetInnerHTML={{ __html: text }} />
      {(kids && !isCollapse) && (
        <Child>{kids.map(kid => <Comment id={kid} key={kid} /> )}</Child>
      )}
    </Container>
  )
}

export default Comment