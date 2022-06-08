import { formatDistance } from 'date-fns'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Link } from 'react-router-dom'

interface StoryProps {
  data: ItemData
  index?: number
  showText: boolean
}

const Container = styled.article`
  display: flex;
  color: var(--gray);

  & + & {
    margin-top: 10px;
  }
`

const Numbering = styled.div`
  width: 20px;
  margin-right: 5px;
  text-align: right;
`

const Title = styled.h4`
  display: inline;
  color: var(--secondary-color);
  font-weight: 400;
  line-height: 1.25em;
`

const TitleLink = styled.a`
  &:hover {
    color: var(--secondary-color);
  }
`

const SubtitleLink = css`
  color: inherit;
`

const Subtitle = styled.p`
  margin-top: 5px;
  color: var(--gray);
  font-size: 11px;
`

const Content = styled.div`
  width: calc(100% - 25px);
`

const Text = styled.div`
  margin-top: 15px;
  margin-left: 25px;
  font-size: 12px;

  & p {
    margin: 10px 0;
  }

  & code, & pre {
    white-space: pre-wrap;
  }
`

function InfoDetails({ data }: { data: ItemData }) {
  const createdTime = data.time && formatDistance(data.time * 1000, new Date(), { addSuffix: true })

  if (data.type === 'job') {
    return <Subtitle>{createdTime}</Subtitle>
  }

  return (
    <Subtitle>
      {`${data.score} points by `}
      <Link to={`/user/${data.by}`} css={SubtitleLink}>
        <b>{data.by}</b>
      </Link>
      {` ${createdTime} | `}
      <Link to={`/comments/${data.id}`} css={SubtitleLink}>
        {data.descendants === 0 ? 'discuss' : `${data.descendants} comments`}
      </Link>
    </Subtitle>
  )
}

function Story({ data, index, showText }: StoryProps) {
  if (data.dead || data.deleted) return null

  return (
    <>
      <Container>
        <Numbering>{index && `${index}.`}</Numbering>
        <Content>
          <TitleLink href={data.url ? data.url : `/comments/${data.id}`} target="_blank" rel="noreferrer">
            <Title>{data.title}</Title>
          </TitleLink>
          <InfoDetails data={data} />
        </Content>
      </Container>
      {(showText && data.text) && <Text dangerouslySetInnerHTML={{ __html: data.text }} />}
    </>
  )
}

export default Story
