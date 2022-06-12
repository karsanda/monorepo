import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import Story from './story'
import Comment from './comment'
import { CommentShimmer } from './shimmer'
import useFetch from '../hooks/useFetch'

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
    return <CommentShimmer />
  }

  const { kids } = data
  return (
    <>
      <Story data={data} showText numbering={false} />
      <CommentsList>
        {kids && kids.map(kid => <CommentRenderer key={kid} id={kid} />)}
      </CommentsList>
    </>
  )
}

export default Comments
