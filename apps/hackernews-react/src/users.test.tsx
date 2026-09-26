import type { Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import userEvent from '@testing-library/user-event'
import Users from './users'
import useFetch from './hooks/useFetch'
import { mockUser } from './mocks/user'
import { mockComment } from './mocks/comment'
import { mockJob, mockStory } from './mocks/story'
import { format } from 'date-fns'

vi.mock('./hooks/useFetch.tsx', () => ({ default: vi.fn() }))
const mockedUseFetch = useFetch as Mock

function renderUserPage(userid: string) {
  return render(
    <MemoryRouter initialEntries={[`/user/${userid}`]}>
      <Routes>
        <Route path="/user/:userid" element={<Users />} />
      </Routes>
    </MemoryRouter>,
  )
}

test('should be able to render successfully', () => {
  mockedUseFetch.mockImplementation(() => ({ state: 'fetched' }))

  const { baseElement } = renderUserPage('dummy')

  expect(baseElement).toBeTruthy()
})

test('should be able to see user info', () => {
  const user = mockUser('dummy-name', [11, 12, 13])

  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/user/dummy-name') return { state: 'fetched', data: user }

    return { state: 'fetched' }
  })

  renderUserPage('dummy-name')

  // Each label and its value are sibling cells in the info grid.
  const valueOf = (label: string) => screen.getByText(label).nextElementSibling

  expect(valueOf('User:')).toHaveTextContent(user.id)
  expect(valueOf('Karma:')).toHaveTextContent(String(user.karma))
  expect(valueOf('Created:')).toHaveTextContent(format(user.created * 1000, 'MMMM dd, yyyy'))
  expect(valueOf('About:')).toHaveTextContent(user.about!.replace(/\s+/g, ' '))
})

test('should be able to see user stories & comments', async () => {
  const user = mockUser('dummy-name', [11, 12, 13, 14])

  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/user/dummy-name') return { state: 'fetched', data: user }

    if (url === '/item/11') return { state: 'fetched', data: mockStory(11) }

    if (url === '/item/12') return { state: 'fetched', data: mockStory(12) }

    if (url === '/item/13') return { state: 'fetched', data: mockComment(13, 12) }

    if (url === '/item/14') return { state: 'fetched', data: mockJob(14) }

    return { state: 'fetched' }
  })

  renderUserPage('dummy-name')

  const storyFilterButton = await screen.findByRole('button', { name: 'Submissions' })
  const commentFilterButton = await screen.findByRole('button', { name: 'Comments' })

  expect(screen.getByTestId('story-11')).toBeInTheDocument()
  expect(screen.getByTestId('story-12')).toBeInTheDocument()

  await userEvent.click(commentFilterButton)

  expect(screen.getByTestId('comment-13')).toBeInTheDocument()

  await userEvent.click(storyFilterButton)

  expect(screen.getByTestId('story-11')).toBeInTheDocument()
  expect(screen.getByTestId('story-12')).toBeInTheDocument()
})
