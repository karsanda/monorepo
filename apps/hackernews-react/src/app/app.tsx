import styled from '@emotion/styled'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import List from './list'
import NavBar from './navbar'

const Header = styled.header`
  padding: 5px 10px;
  background-color: var(--dark-bg);
`

const Footer = styled.footer`
  border-top: 2px solid var(--primary-color);
  margin: 0 5px;
  padding: 10px 0;
  text-align: center;
  font-size: 0.8em;
`

function App() {
  return (
    <BrowserRouter>
      <Header>
        <NavBar />
      </Header>
      <Routes>
        <Route index element={<List type='topstories' />} />
        <Route path='/topstories' element={<List type='topstories' />} />
        <Route path='/newstories' element={<List type='newstories' />} />
        <Route path='/beststories' element={<List type='beststories' />} />
      </Routes>
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
