import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { mockStory, mockJob } from '../mocks/story'
import { mockComment } from '../mocks/comment'
import Comment from './comment'
import useFetch from '../hooks/useFetch'

jest.mock('../hooks/useFetch.tsx', () => jest.fn())
const mockedUseFetch = useFetch as jest.Mock

test('should be able to render successfully', () => {
  mockedUseFetch.mockImplementation((_url: string) => {
    return { state: 'fetched' }
  })

  const comment = mockComment('555', '444')
  render(
    <BrowserRouter>
      <Comment data={comment} />
    </BrowserRouter>
  )

  expect(screen.getByTestId('dummy-comment')).toHaveTextContent('This is a comment')
})

test('should be able to render its story parent successfully', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/item/444') return { state: 'fetched', data: mockStory('444') }

    return { state: 'fetched' }
  })

  const comment = mockComment('555', '444')
  render(
    <BrowserRouter>
      <Comment data={comment} showParent />
    </BrowserRouter>
  )

  expect(screen.getByTestId('story-444')).toBeInTheDocument()
})

test('should be able to render its story parent successfully when comment has many kids', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/item/5') return { state: 'fetched', data: mockComment('5', '4') }

    if (url === '/item/4') return { state: 'fetched', data: mockStory('4') }

    return { state: 'fetched' }
  })

  const comment = mockComment('6', '5')
  render(
    <BrowserRouter>
      <Comment data={comment} showParent />
    </BrowserRouter>
  )

  expect(screen.getByTestId('story-4')).toBeInTheDocument()
})

test('should render no information when type is not story or comment', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/item/444') return { state: 'fetched', data: mockJob('444') }

    return { state: 'fetched' }
  })

  const comment = mockComment('555', '444')
  render(
    <BrowserRouter>
      <Comment data={comment} showParent />
    </BrowserRouter>
  )

  expect(screen.queryByTestId('story-444')).not.toBeInTheDocument()
})

test('should render no information when story or comment is deleted or dead', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/item/444') return {
      state: 'fetched',
      data: { ...mockStory('444'), deleted: true, dead: true }
    }

    return { state: 'fetched' }
  })

  const comment = mockComment('555', '444')
  render(
    <BrowserRouter>
      <Comment data={comment} showParent />
    </BrowserRouter>
  )

  expect(screen.queryByTestId('story-444')).not.toBeInTheDocument()
})

test('should render null if data is deleted', () => {
  const deletedComment = { ...mockComment('6', '5'), deleted: true }
  render(
    <BrowserRouter>
      <Comment data={deletedComment} />
    </BrowserRouter>
  )
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})

test('should render null if data is dead', () => {
  const deletedComment = { ...mockComment('6', '5'), dead: true }
  render(
    <BrowserRouter>
      <Comment data={deletedComment} />
    </BrowserRouter>
  )
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})

test('should collapse the children of comments when arrow is clicked', async () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/item/444') return { state: 'fetched', data: mockStory('444') }

    if (url === '/item/666') return { state: 'fetched', data: mockComment('666', '555') }

    return { state: 'fetched' }
  })

  const comment = mockComment('555', '444')
  const commentWithKid = { ...comment, kids: [666] }

  render(
    <BrowserRouter>
      <Comment data={commentWithKid} showParent />
    </BrowserRouter>
  )

  expect(screen.getByTestId('comment-555')).toBeInTheDocument()
  expect(screen.getByTestId('comment-666')).toBeInTheDocument()

  await userEvent.click(await screen.findByRole('button', { name: 'collapsible-button-555'}))

  expect(screen.getByTestId('comment-555')).toBeInTheDocument()
  expect(screen.queryByTestId('comment-666')).not.toBeInTheDocument()
})