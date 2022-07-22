import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const ListItem = styled.li`
  height: 35px;
  width: calc(100% - 25px);
  color: var(--gray);

  & + & {
    margin-top: 10px;
  }
`

const Article = styled.article`
  padding-left: 5px;
  width: calc(100% - 25px);
  height: 35px;

  & + & {
    margin-top: 10px;
  }
`

const Title = styled.div`
  height: 16px;
  width: 260px;
`

const Subtitle = styled.div`
  margin-top: 5px;
  height: 12px;
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

export function ListItemShimmer() {
  return (
    <ListItem>
      <Title css={GradientAnimation} />
      <Subtitle css={GradientAnimation} />
    </ListItem>
  )
}

export function ArticleShimmer() {
  return (
    <Article>
      <Title css={GradientAnimation} />
      <Subtitle css={GradientAnimation} />
    </Article>
  )
}
