import { formatDistance } from 'date-fns'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

interface StoryProps {
  data: ItemData
  showText: boolean
  numbering?: boolean
}

const Title = styled.h2`
  display: inline;
  color: var(--secondary-color);
  font-size: 1em;
  font-weight: 400;
  line-height: 1.25em;
`

const TitleLink = styled.a`
  &:hover {
    color: var(--secondary-color);
  }
`

const Subtitle = styled.p`
  margin-top: 5px;
  color: var(--gray);
  font-size: 11px;

  & > a {
    color: var(--gray);
  }

  @media only screen and (max-width: 400px) {
    font-size: 11px;
  }
`

const Content = styled.article`
  width: calc(100% - 25px);
  margin-left: 5px;
`

const Text = styled.div`
  margin-top: 15px;
  margin-left: 6px;
  font-size: 12px;
  color: var(--gray);

  & p {
    margin: 10px 0;
  }

  & code, & pre {
    white-space: pre-wrap;
  }
`

export const Container = styled.li`
  color: var(--gray);

  & + & {
    margin-top: 10px;
  }

  @media only screen and (max-width: 400px) {
    font-size: 13px;
  }
`

function InfoDetails({ data }: { data: ItemData }) {
  const createdTime = data.time && formatDistance(data.time * 1000, new Date(), { addSuffix: true })
  if (data.type === 'job') return <Subtitle>{createdTime}</Subtitle>

  return (
    <Subtitle>
      {`${data.score} points by `}
      <Link to={`/user/${data.by}`}>
        <b>{data.by}</b>
      </Link>
      {` ${createdTime} | `}
      <Link to={`/comments/${data.id}`}>
        {data.descendants === 0 ? 'discuss' : `${data.descendants} comments`}
      </Link>
    </Subtitle>
  )
}

function Story({ data, showText, numbering = true }: StoryProps) {
  if (data.dead || data.deleted) return null
  
  const StoryContent = (
    <>
      <Content>
        <TitleLink href={data.url ? data.url : `/comments/${data.id}`} target="_blank" rel="noreferrer">
          <Title>{data.title}</Title>
        </TitleLink>
        <InfoDetails data={data} />
      </Content>
      {(showText && data.text) && <Text dangerouslySetInnerHTML={{ __html: data.text }} />}
    </>
  )

  return numbering ? (
    <Container>
      {StoryContent}
    </Container>
  ) : StoryContent
}

export default Story
