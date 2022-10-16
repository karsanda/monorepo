import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Link, useLocation } from 'react-router-dom'

const Nav = styled.nav`
  display: flex;
  align-items: center;
  line-height: 1em;
`

const Title = styled.h1`
  color: var(--primary-color);
  font-size: 14px;
  margin-right: 10px;
  font-weight: 600;

  @media only screen and (max-width: 400px) {
    font-size: 14px;
  }

  @media only screen and (max-width: 360px) {
    font-size: 13px;
    margin-right: 7px;
  }
`

const NavLink = (path: string, type: string) => css`
  color: var(--white);
  padding: 0 8px;
  font-weight: ${path.includes(type) ? 600 : 400};
  height: 14px;

  @media only screen and (max-width: 400px) {
    font-size: 13px;
    height: 13px;
  }

  @media only screen and (max-width: 400px) {
    font-size: 12px;
    padding: 0 7px;
    height: 12px;
  }
`

function NavBar() {
  const { pathname } = useLocation()
  return (
    <Nav>
      <Link to='/' data-page='topstories'><Title>Hacker News - React</Title></Link>
      <Link to='/newstories' css={NavLink(pathname, 'newstories')} data-page='newstories'>New</Link>
      <Link to='/beststories' css={NavLink(pathname, 'beststories')} data-page='beststories'>Best</Link>
      <Link to='/askstories' css={NavLink(pathname, 'askstories')} data-page='askstories'>Ask</Link>
      <Link to='/showstories' css={NavLink(pathname, 'showstories')} data-page='showstories'>Show</Link>
      <Link to='/jobstories' css={NavLink(pathname, 'jobstories')} data-page='jobstories'>Jobs</Link>
    </Nav>
  )
}

export default NavBar
