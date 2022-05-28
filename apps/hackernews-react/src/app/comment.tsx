import styled from '@emotion/styled'
import { formatDistance } from 'date-fns'
import useFetch from '../hooks/useFetch'

const Container = styled.article`
  margin-right: 10px;

  & + & {
    margin-top: 15px;
  }
`

const Subtitle = styled.p`
  margin: 5px 0;
  color: var(--gray);
  font-size: 11px;
`

const Content = styled.div`
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

  if (!data) return null

  const { by, time, kids } = data
  return (
    <Container>
      <Subtitle>
        {by} {time && formatDistance(time * 1000, new Date(), { addSuffix: true })}
      </Subtitle>
      <Content dangerouslySetInnerHTML={{ __html: data.text }} />
      {kids && (
        <Child>
          {kids.map(kid => <Comment id={kid} key={kid} /> )}
        </Child>
      )}
    </Container>
  )
}

export default Comment