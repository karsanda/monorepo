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

const Title = styled.div`
  height: 16px;
  width: 320px;
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

export const Container = styled.li`
  height: 35px;
  color: var(--gray);

  & + & {
    margin-top: 10px;
  }
`

export function StoryShimmer() {
  return (
    <Container>
      <Content>
        <Title css={GradientAnimation} />
        <Subtitle css={GradientAnimation} />
      </Content>
    </Container>
  )
}

export function CommentShimmer() {
  return (
    <ShimmerContainer>
      <StoryShimmer />
    </ShimmerContainer>
  )
}
