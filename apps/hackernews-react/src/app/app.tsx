import styled from '@emotion/styled'
import { Routes, Route } from 'react-router-dom'
import Stories from './stories'
import NavBar from './navbar'
import Comments from './comments'
import Users from './users'

const Header = styled.header`
  padding: 10px;
  background-color: var(--dark-bg);
`

export const Main = styled.main`
  padding: 10px 5px 10px 0;
  min-height: calc(100vh - 97px);

  @media only screen and (max-width: 400px) {
    min-height: calc(100vh - 81px);
  }
`

const Footer = styled.footer`
  border-top: 2px solid var(--primary-color);
  margin: 0 5px;
  padding: 10px 0;
  text-align: center;
  font-size: 11px;
`

function App() {
  return (
    <>
      <Header>
        <NavBar />
      </Header>
      <Routes>
        <Route index element={<Stories type='topstories' />} />
        <Route path='/topstories' element={<Stories type='topstories' />} />
        <Route path='/newstories' element={<Stories type='newstories' />} />
        <Route path='/beststories' element={<Stories type='beststories' />} />
        <Route path='/askstories' element={<Stories type='askstories' />} />
        <Route path='/showstories' element={<Stories type='showstories' />} />
        <Route path='/jobstories' element={<Stories type='jobstories' />} />
        <Route path='/comments/:itemid' element={<Comments />} />
        <Route path='/user/:userid' element={<Users />} />
      </Routes>
      <Footer aria-label='footer'>
        ©{new Date().getFullYear()} Karsanda |{' '}
        <a href="https://github.com/karsanda/monorepo/tree/main/apps/hackernews-react">
          Hacker News - React
        </a>
      </Footer>
    </>
  )
}

export default App
