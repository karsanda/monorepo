import { useState } from 'react'
import styled from '@emotion/styled'
import { formatDistance } from 'date-fns'
import { Link } from 'react-router-dom'
import { ArticleShimmer } from './shimmer'
import useFetch from '../hooks/useFetch'

interface CommentProps {
  data: ItemData
  disableChildren?: boolean
  showParent?: boolean
}

const Container = styled.article`
  margin-right: 10px;
  margin-left: 5px;

  & + & {
    margin-top: 15px;
  }

  &[data-disable-children="true"] > div {
    margin-left: 5px;
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
  color: var(--gray);
`

const Info = styled.p`
  margin: 5px 0;
  color: var(--gray);
  font-size: 11px;

  & > a {
    color: var(--gray);
  }
`

const Content = styled.div`
  margin-left: 17px;
  font-size: 12px;
  word-break: break-word;

  & p {
    margin: 10px 0;
  }

  & code, & pre {
    white-space: pre-wrap;
  }
`

const Children = styled.div`
  margin-left: 25px;

  ${Header} {
    margin-top: 10px;
  }
`

const StoryLink = styled.span`
  color: var(--gray);

  & > a {
    color: var(--gray);
  }
`

function CommentRenderer({ id, showParent = false }: { id: number, showParent?: boolean }) {
  const { data } = useFetch<ItemData>(`item/${id}`)
  if (!data) return <ArticleShimmer />

  return <Comment data={data} showParent={showParent} />
}

function ParentRenderer({ id }: { id?: number }) {
  const { data } = useFetch<ItemData>(`item/${id}`)
  if (!data) return null
  if (data.dead || data.deleted) return null

  switch(data.type) {
    case 'story':
      return (
        <StoryLink>
          {` on `}
          <Link to={`/comments/${data.id}`} target="_blank" rel="noreferrer">
            {data.title}
          </Link>
        </StoryLink>
      )
    case 'comment':
      return <ParentRenderer id={data.parent} />
    default:
      return null
  }
}

function Comment({ data, disableChildren = false, showParent = false }: CommentProps) {
  const [ isCollapse, setIsCollapse ] = useState(false)
  if (data.dead || data.deleted) return null

  const createdTime = data.time && formatDistance(data.time * 1000, new Date(), { addSuffix: true })
  return (
    <Container data-disable-children={disableChildren}>
      <Header>
        {!disableChildren && (
          <CollapsibleButton onClick={() => setIsCollapse(!isCollapse)}>
            {isCollapse ? '▼' : '▲'}
          </CollapsibleButton>
        )}
        <Info>
          <Link to={`/user/${data.by}`}>
            <b>{data.by}</b>
          </Link>
          {` ${createdTime}`}
          {(showParent && data.parent) && <ParentRenderer id={data.parent} />}
        </Info>
      </Header>
      {data.text && <Content dangerouslySetInnerHTML={{ __html: data.text }} /> }
      {(!disableChildren && data.kids && !isCollapse) && (
        <Children>
          {data.kids.map(kid => <CommentRenderer id={kid} key={kid} />)}
        </Children>
      )}
    </Container>
  )
}

export default Comment