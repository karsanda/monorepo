import { Suspense } from "react"
import styled from '@emotion/styled'
import useFetch from "../hooks/useFetch"
import Item from "./item"

const Container = styled.div`
  // Your style here
`;

function App() {
  const { data } = useFetch<string[]>('https://hacker-news.firebaseio.com/v0/topstories.json')
  return (
    <Container>
      <header />
      <Suspense fallback={<main>Loading...</main>}>
        <main>
          <ol>{data?.splice(0, 10).map(id => <Item key={id} id={id} />)}</ol>
        </main>
      </Suspense>
      <footer />
    </Container>
  )
}

export default App
