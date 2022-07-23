import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NavBar from './navbar'

test('should render successfully', () => {
  const { baseElement } = render(
    <MemoryRouter initialEntries={['/']}>
      <NavBar />
    </MemoryRouter>
  )

  expect(baseElement).toBeTruthy()
})

test('active page should be bold', () => {
  render(
    <MemoryRouter initialEntries={['/askstories']}>
      <NavBar />
    </MemoryRouter>
  )

  expect(screen.getByRole('link', { name: 'Ask'})).toHaveStyle('font-weight: 600')
})