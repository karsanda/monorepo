import { useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { formatDistance } from 'date-fns'
import { Link } from 'react-router-dom'
import { CommentShimmer } from './shimmer'
import useFetch from '../hooks/useFetch'

interface CommentProps {
  data: ItemData
  disableChildren?: boolean
}

const Container = styled.article`
  margin-right: 10px;

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
`

const Info = styled.p`
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

const Children = styled.div`
  margin-left: 25px;
`

const SubtitleLink = css`
  color: inherit;
`

function CommentRenderer({ id }: { id: number }) {
  const { data } = useFetch<ItemData>(`item/${id}`)
  return !data ? <CommentShimmer /> : <Comment data={data} />
}

function Comment({ data, disableChildren = false }: CommentProps) {
  const [ isCollapse, setIsCollapse ] = useState(false)

  if (data.dead) return null

  if (data.deleted) {
    return (
      <Container data-disable-children={disableChildren}>
        <Header>
          {!disableChildren && <CollapsibleButton>▼</CollapsibleButton>}
          <Info>[deleted]</Info>
        </Header>
      </Container>
    )
  }

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
          <Link to={`/user/${data.by}`} css={SubtitleLink}>
            <b>{data.by}</b>
          </Link>
          {` ${createdTime}`}
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