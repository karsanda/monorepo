import { formatDistance } from 'date-fns'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

interface StoryProps {
  data: StoryData
  showText?: boolean
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

function Information({ data }: { data: StoryData }) {
  const createdTime = data.time && formatDistance(data.time * 1000, new Date(), { addSuffix: true })

  if (data.type === 'job') return <Subtitle>{createdTime}</Subtitle>

  const UserLink = () => <Link to={`/user/${data.by}`}><b>{data.by}</b></Link>

  const CommentLink = () => <Link to={`/comments/${data.id}`}>{data.descendants} comments</Link>

  return data.descendants && data.descendants > 0
    ? <Subtitle>{data.score} points by <UserLink /> {createdTime} | <CommentLink/></Subtitle>
    : <Subtitle>{data.score} points by <UserLink /> {createdTime}</Subtitle>
}

export default function Story({ data, showText = false }: StoryProps) {
  if (data.dead || data.deleted) return null
  
  return (
    <>
      <Content data-testid={`story-${data.id}`}>
        <TitleLink href={data.url ? data.url : `/comments/${data.id}`} target="_blank" rel="noreferrer">
          <Title>{data.title}</Title>
        </TitleLink>
        <Information data={data} />
      </Content>
      {(showText && data.text) && <Text dangerouslySetInnerHTML={{ __html: data.text }} />}
    </>
  )
}
