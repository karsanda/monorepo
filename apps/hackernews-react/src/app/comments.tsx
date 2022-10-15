import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import Story from './story'
import Comment from './comment'
import { ArticleShimmer } from './shimmer'
import { Main } from './app'
import useFetch from '../hooks/useFetch'
import { itemURI } from '../utils/api-list'

const CommentsList = styled.section`
  margin-top: 15px;
  margin-bottom: 10px;
`

export default function Comments() {
  const params = useParams()
  const { data } = useFetch<StoryData | CommentData>(itemURI(params['itemid']))

  if (!data) return (
    <Main aria-label='comments'>
      <ArticleShimmer />
    </Main>
  )

  function CommentRenderer({ id }: { id: number }) {
    const { data } = useFetch<CommentData>(itemURI(id.toString()))
    return !data ? <ArticleShimmer /> : <Comment data={data} />
  }

  return (
    <Main aria-label='comments'>
      {data.type === 'story' && <Story data={data} showText />}
      <CommentsList>
        {data.kids && data.kids.map(kid => <CommentRenderer key={kid} id={kid} />)}
      </CommentsList>
    </Main>
  )
}
