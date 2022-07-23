import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import Story from './story'
import Comment from './comment'
import { ArticleShimmer } from './shimmer'
import { Main } from './app'
import useFetch from '../hooks/useFetch'

const CommentsList = styled.section`
  margin-top: 15px;
  margin-bottom: 10px;
`

function CommentRenderer({ id }: { id: number }) {
  const { data } = useFetch<ItemData>(`item/${id}`)
  return !data ? <ArticleShimmer /> : <Comment data={data} />
}

function Comments() {
  const params = useParams()
  const response = useFetch<ItemData>(`item/${params['itemid']}`)

  if (!response.data) {
    return (
      <Main aria-label='comments'>
        <ArticleShimmer />
      </Main>
    )
  }

  const { kids } = response.data
  return (
    <Main aria-label='comments'>
      <Story data={response.data} showText numbering={false} />
      <CommentsList>
        {kids && kids.map(kid => <CommentRenderer key={kid} id={kid} />)}
      </CommentsList>
    </Main>
  )
}

export default Comments
