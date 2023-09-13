import { useState } from 'react'
import styled from '@emotion/styled'
import { formatDistance } from 'date-fns'
import { Link } from 'react-router-dom'
import { ArticleShimmer } from './shimmer'
import useFetch from '../hooks/useFetch'
import { itemURI } from '../utils/api-list'

interface CommentProps {
  data: CommentData
  disableChildren?: boolean
  showParent?: boolean
}

type ParentProps = {
  id: string
  title: string
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

  & div[data-testid="header"] {
    margin-top: 10px;
  }
`

const Story = styled.span`
  color: var(--gray);

  & > a {
    color: var(--gray);
  }
`

function CommentChildren({ id, showParent = false }: { id: number, showParent?: boolean }) {
  const { data } = useFetch<CommentData>(itemURI(id.toString()))
  return data ? <Comment data={data} showParent={showParent} /> : <ArticleShimmer />
}

function StoryLink({ id, title }: ParentProps) {
  return <Link to={`/comments/${id}`} target="_blank" rel="noreferrer">{title}</Link>
}

function Parent({ id }: { id?: number }) {
  const { data } = useFetch<StoryData | CommentData>(itemURI(id?.toString()))

  if (!data || data.dead || data.deleted) return null

  switch(data.type) {
    case 'story':
      return <Story data-testid={`story-${data.id}`}>on <StoryLink id={data.id} title={data.title} /></Story>
    case 'comment':
      return <Parent id={data.parent} />
    default:
      return null
  }
}

function Information({ data, showParent }: CommentProps) {
  const createdTime = data.time && formatDistance(data.time * 1000, new Date(), { addSuffix: true })

  const UserLink = () => <Link to={`/user/${data.by}`}><b>{data.by}</b></Link>

  return (
    <Info>
      <UserLink /> {createdTime} {(showParent && data.parent) && <Parent id={data.parent} />}
    </Info>
  )
}

export default function Comment({ data, disableChildren = false, showParent = false }: CommentProps) {
  const [ isCollapse, setIsCollapse ] = useState(false)

  if (data.dead || data.deleted) return null

  return (
    <Container data-disable-children={disableChildren} data-testid={`comment-${data.id}`}>
      <Header data-testid='header'>
        {!disableChildren && (
          <CollapsibleButton onClick={() => setIsCollapse(!isCollapse)} aria-label={`collapsible-button-${data.id}`}>
            {isCollapse ? '▼' : '▲'}
          </CollapsibleButton>
        )}
        <Information data={data} showParent={showParent} />
      </Header>
      {data.text && <Content dangerouslySetInnerHTML={{ __html: data.text }} /> }
      {(!disableChildren && data.kids && !isCollapse) && (
        <Children>
          {data.kids.map(kid => <CommentChildren id={kid} key={kid} />)}
        </Children>
      )}
    </Container>
  )
}
