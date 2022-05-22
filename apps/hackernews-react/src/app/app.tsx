import styled from '@emotion/styled'
import { BrowserRouter, Routes, Route, Link, useSearchParams } from "react-router-dom"
import useFetch from '../hooks/useFetch'
import Item from './item'
import { getPage, paginateData, PAGE_SIZE } from '../utils'

const Header = styled.header`
  padding: 5px 10px;
  background-color: var(--dark-bg);
  color: var(--primary-color);
`

const Title = styled.h1`
  font-size: 14px;
`

const Main = styled.main`
  padding: 10px 5px;
  min-height: calc(100vh - 116px);
`

const Footer = styled.footer`
  border-top: 2px solid var(--primary-color);
  margin: 0 5px;
  padding: 10px 0;
  text-align: center;
  font-size: 0.8em;
`

const LinkMore = styled.div`
  margin-top: 15px;
  margin-left: 33px;
`

function TopStories({ data }: { data: string[] }) {
  const [params] = useSearchParams()
  const page = getPage(params)
  const renderedData = paginateData(data, page)
  const calcIndex = (index: number) => (30 * (page - 1)) + (index + 1)
  return (
    <>
      {renderedData.map((id: string, index) => (<Item index={calcIndex(index)} key={id} id={id} />))}
      {page < Math.ceil(data.length / PAGE_SIZE) && (
        <LinkMore>
          <Link to={`/topstories?page=${page + 1}`} rel="noreferrer">More</Link>
        </LinkMore>
      )}
    </>
  )
}

function App() {
  const { data } = useFetch<string[]>('topstories')
  if (!data) return null

  return (
    <BrowserRouter>
      <Header>
        <Title>Hacker News - React</Title>
      </Header>
      <Main>
        <Routes>
          <Route index element={<TopStories data={data} />} />
          <Route path='/topstories' element={<TopStories data={data} />} />
        </Routes>
      </Main>
      <Footer>
        ©{new Date().getFullYear()} Karsanda |{' '}
        <a href="https://github.com/karsanda/monorepo/tree/main/apps/hn-react">
          Hacker News - React
        </a>
      </Footer>
    </BrowserRouter>
  )
}

export default App
