
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Link, useLocation } from "react-router-dom"

const Nav = styled.nav`
  display: flex;
  align-items: center;
`

const Title = styled.h1`
  color: var(--primary-color);
  font-size: 14px;
  margin-right: 10px;
  font-weight: 600;
`

const NavLink = (path: string, type: string) => css`
  color: var(--white);
  padding: 0 10px;
  font-weight: ${path.includes(type) ? 600 : 400};
`

function NavBar() {
  const { pathname } = useLocation()
  return (
    <Nav>
      <Link to='/'><Title>Hacker News - React</Title></Link>
      <Link to='/newstories' css={NavLink(pathname, 'newstories')}>New</Link>
      <Link to='/beststories' css={NavLink(pathname, 'beststories')}>Best</Link>
      <Link to='/askstories' css={NavLink(pathname, 'askstories')}>Ask</Link>
      <Link to='/showstories' css={NavLink(pathname, 'showstories')}>Show</Link>
      <Link to='/jobstories' css={NavLink(pathname, 'jobstories')}>Jobs</Link>
    </Nav>
  )
}

export default NavBar
