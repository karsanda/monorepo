import styled from '@emotion/styled'
import { css } from '@emotion/react'

const ShimmerContainer = styled.article`
  height: 35px;

  & + & {
    margin-top: 10px;
  }
`

const Content = styled.div`
  width: calc(100% - 25px);
`

const TitleShimmer = styled.div`
  height: 16px;
  width: 320px;
`

const SubtitleShimmer = styled.div`
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

export function StoryShimmer() {
  return (
    <Content>
      <TitleShimmer css={GradientAnimation} />
      <SubtitleShimmer css={GradientAnimation} />
    </Content>
  )
}

export function CommentShimmer() {
  return (
    <ShimmerContainer>
      <StoryShimmer />
    </ShimmerContainer>
  )
}