import useFetch from '../hooks/useFetch'
import Story from './story'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import Comment from './comment';

interface ItemProps {
  id: string;
  index?: number;
  showText?: boolean
  filter?: 'STORIES' | 'COMMENTS' | 'NONE'
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

function Shimmer({ index }: { index?: number }) {
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

function Item({ id, index, showText = false, filter='NONE' }: ItemProps) {
  const { data } = useFetch<ItemData>(`item/${id}`)

  if (!data) return <Shimmer index={index} /> 

  switch(data.type) {
    case 'story':
    case 'job':
      if (filter === 'COMMENTS') return null
      return <Story data={data} index={index} showText={showText} />
    case 'comment':
      if (filter === 'STORIES') return null
      return <Comment data={data} />
    default:
      return null
  }
}

export default Item
