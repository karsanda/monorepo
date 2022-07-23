import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import App from './app'

test('should render successfully', () => {
  const { baseElement } = render(<App />, { wrapper: BrowserRouter })
  expect(baseElement).toBeTruthy()

  expect(screen.getByRole('navigation')).toBeTruthy()
  expect(screen.getByRole('contentinfo', { name: 'footer' })).toBeTruthy()
})

describe('navigation', () => {
  let user: UserEvent

  beforeEach(() => {
    render(<App />, { wrapper: BrowserRouter })
    user = userEvent.setup()
  })

  test('should render index page by default', () => {
    expect(screen.getByRole('main', { name: 'topstories' })).toBeTruthy()
  })

  test('when title is clicked, should be able to navigate to index', async () => {
    await user.click(screen.getByText('New'))
    expect(screen.getByRole('main', { name: 'newstories' })).toBeTruthy()

    await user.click(screen.getByRole('heading', { name: 'Hacker News - React' }))
    expect(screen.getByRole('main', { name: 'topstories' })).toBeTruthy()
  })

  test.each([
    ['New', 'newstories'],
    ['Best', 'beststories'],
    ['Ask', 'askstories'],
    ['Show', 'showstories'],
    ['Jobs', 'jobstories']
  ])('when %s is clicked, should be able to navigate to /%s', async (text, name) => {
    await user.click(screen.getByText(text))
    expect(screen.getByRole('main', { name })).toBeTruthy()
  })
})

test('should be able to render user page', () => {
  render(
    <MemoryRouter initialEntries={['/user/johndoe']}>
      <App />
    </MemoryRouter>
  )

  expect(screen.getByRole('main', { name: 'user' })).toBeTruthy()
})

test('should be able to render comments page', () => {
  render(
    <MemoryRouter initialEntries={['/comments/123']}>
      <App />
    </MemoryRouter>
  )

  expect(screen.getByRole('main', { name: 'comments' })).toBeTruthy()
})