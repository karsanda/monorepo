import styled from '@emotion/styled'
import { useParams } from 'react-router'
import Story from './components/story'
import Comment from './components/comment'
import { ArticleShimmer } from './components/shimmer'
import { Main } from './components/main'
import useFetch from './hooks/useFetch'
import { itemURI, type CommentData, type StoryData } from '@repo/hn-core'

const CommentsList = styled.section`
  margin-top: 15px;
  margin-bottom: 10px;
`

function CommentRenderer({ id }: { id: number }) {
  const { data } = useFetch<CommentData>(itemURI(id))
  return !data ? <ArticleShimmer /> : <Comment data={data} />
}

export default function Comments() {
  const { itemid } = useParams()
  const { data } = useFetch<StoryData | CommentData>(itemid ? itemURI(itemid) : null)

  if (!data)
    return (
      <Main aria-label="comments">
        <ArticleShimmer />
      </Main>
    )

  return (
    <Main aria-label="comments">
      {data.type === 'story' && <Story data={data} showText />}
      <CommentsList>
        {data.kids && data.kids.map((kid) => <CommentRenderer key={kid} id={kid} />)}
      </CommentsList>
    </Main>
  )
}
