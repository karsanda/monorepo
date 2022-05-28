import { formatDistance } from 'date-fns'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Link } from "react-router-dom"
import useFetch from '../hooks/useFetch'

interface ItemProps {
  id: string;
  index?: number;
  showText?: boolean
}

interface ItemData {
  title: string;
  time: number;
  url?: string;
  type: string;
  by: string;
  score: number;
  descendants: number;
  text?: string
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

const CommentLink = css`
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

const TitleShimmer = styled.div`
  height: 14px;
  width: 320px;
`

const SubtitleShimmer = styled.div`
  margin-top: 5px;
  height: 11px;
  width: 160px;
`

const GradientAnimation = css`
  background: linear-gradient(270deg, #cccccc, #333333);
  background-size: 400% 400%;

  -webkit-animation: gradient 1s ease infinite;
  -moz-animation: gradient 1s ease infinite;
  animation: gradient 1s ease infinite;

  @-webkit-keyframes gradient {
    0%{ background-position: 0% 50% }
    50%{ background-position: 100% 50% }
    100%{ background-position: 0% 50% }
  }

  @-moz-keyframes gradient {
    0%{ background-position: 0% 50% }
    50%{ background-position: 100% 50% }
    100%{ background-position: 0% 50% }
  }

  @keyframes gradient {
    0%{ background-position: 0% 50% }
    50%{ background-position: 100% 50% }
    100%{ background-position: 0% 50% }
  }
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

function StoryShimmer({ index }: { index?: number }) {
  return (
    <Container>
      <Numbering>{index && `${index}.`}</Numbering>
      <Content>
        <TitleShimmer css={GradientAnimation} />
        <SubtitleShimmer css={GradientAnimation} />
      </Content>
    </Container>
  )
}

function Story({ id, index, showText = false }: ItemProps) {
  const { data } = useFetch<ItemData>(`item/${id}`)

  if (!data) return <StoryShimmer index={index} />

  const { url, title, score, by, time, descendants, type, text } = data || {}
  const articleLink = url ? url : `/comments/${id}`
  return (
    <>
      <Container>
        <Numbering>{index && `${index}.`}</Numbering>
        <Content>
          <TitleLink href={articleLink} target="_blank" rel="noreferrer">
            <Title>{title}</Title>
          </TitleLink>
          {type === 'job' ? (
            <Subtitle>
              {time && formatDistance(time * 1000, new Date(), { addSuffix: true })}
            </Subtitle>
          ) : (
            <Subtitle>
              {score} points by <b>{by}</b>{' '}
              {time && formatDistance(time * 1000, new Date(), { addSuffix: true })} {' | '}
              <Link to={`/comments/${id}`} css={CommentLink}>
                {descendants === 0 ? 'discuss' : `${descendants} comments`}
              </Link>
            </Subtitle>
          )}
        </Content>
      </Container>
      {(showText && text) && <Text dangerouslySetInnerHTML={{ __html: text }} />}
    </>
  )
}

export default Story
