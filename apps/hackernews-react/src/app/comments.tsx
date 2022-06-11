import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import Story from './story'
import Comment from './comment'
import { CommentShimmer } from './shimmer'
import useFetch from '../hooks/useFetch'

const Main = styled.main`
  padding: 10px 5px;
  min-height: calc(100vh - 97px);
`

const CommentsList = styled.section`
  margin-top: 15px;
  margin-bottom: 10px;
`

function CommentRenderer({ id }: { id: number }) {
  const { data } = useFetch<ItemData>(`item/${id}`)
  return !data ? <CommentShimmer /> : <Comment data={data} />
}

function Comments() {
  const params = useParams()
  const { data } = useFetch<ItemData>(`item/${params['itemid']}`)

  if (!params || !params['itemid'] || !data) {
    return <Main><CommentShimmer /></Main>
  }

  const { kids } = data
  return (
    <Main>
      <Story data={data} showText />
      <CommentsList>
        {kids && kids.map(kid => <CommentRenderer key={kid} id={kid} />)}
      </CommentsList>
    </Main>
  )
}

export default Comments
