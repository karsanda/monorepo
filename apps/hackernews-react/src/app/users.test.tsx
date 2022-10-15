import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Users from './users'
import useFetch from '../hooks/useFetch'
import { mockUser } from '../mocks/user'
import { mockComment } from '../mocks/comment'
import { mockJob, mockStory } from '../mocks/story'
import { format } from 'date-fns'

jest.mock('../hooks/useFetch.tsx', () => jest.fn())
const mockedUseFetch = useFetch as jest.Mock

function renderUserPage(userid: string) {
  return render(
    <MemoryRouter initialEntries={[`/user/${userid}`]}>
      <Routes>
        <Route path='/user/:userid' element={<Users />} />
      </Routes>
    </MemoryRouter>
  )
}

test('should be able to render successfully', () => {
  mockedUseFetch.mockImplementation(() => ({ state: 'fetched' }))

  const { baseElement } = renderUserPage('dummy')

  expect(baseElement).toBeTruthy()
})

test('should be able to see user info', () => {
  const user = mockUser('dummy-name', ['11', '12', '13'])

  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/user/dummy-name') return { state: 'fetched', data: user }

    return { state: 'fetched' }
  })

  renderUserPage('dummy-name')

  expect(screen.findByText(`User: ${user.id}`))
  expect(screen.findByText(`Karma: ${user.karma}`))
  expect(screen.findByText(`Created: ${format(user.created * 1000, 'MMMM dd, yyyy')}`))
  expect(screen.findByText(`About: ${user.about}`))
})

test('should be able to see user stories & comments', async () => {
  const user = mockUser('dummy-name', ['11', '12', '13', '14'])

  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/user/dummy-name') return { state: 'fetched', data: user }

    if (url === '/item/11') return { state: 'fetched', data: mockStory('11') }

    if (url === '/item/12') return { state: 'fetched', data: mockStory('12') }

    if (url === '/item/13') return { state: 'fetched', data: mockComment('13', '12') }

    if (url === '/item/14') return { state: 'fetched', data: mockJob('14') }

    return { state: 'fetched' }
  })

  renderUserPage('dummy-name')

  const storyFilterButton = await screen.findByRole('button', { name: 'Submissions'})
  const commentFilterButton = await screen.findByRole('button', { name: 'Comments'})

  expect(screen.getByTestId('story-11')).toBeInTheDocument()
  expect(screen.getByTestId('story-12')).toBeInTheDocument()

  await userEvent.click(commentFilterButton)

  expect(screen.getByTestId('comment-13')).toBeInTheDocument()

  await userEvent.click(storyFilterButton)

  expect(screen.getByTestId('story-11')).toBeInTheDocument()
  expect(screen.getByTestId('story-12')).toBeInTheDocument()
})