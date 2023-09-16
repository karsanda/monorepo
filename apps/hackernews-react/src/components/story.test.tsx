import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { mockStory, mockNewStory, mockStoryWithText, mockJob } from '../mocks/story'
import { subHours } from 'date-fns'
import Story from './story'

const oneHourAgo = Math.floor(subHours(new Date(), 1).getTime() / 1000)

test('should render story item correctly', () => {
  const story = { ...mockStory('1'), time: oneHourAgo }
  render(
    <BrowserRouter>
      <Story data={story} />
    </BrowserRouter>
  )

  expect(screen.getByRole('link', { name: story.title })).toHaveAttribute('href', story.url)
  expect(screen.getByRole('link', { name: story.by })).toHaveAttribute('href', `/user/${story.by}`)
  expect(screen.getByRole('link', { name: `${story.descendants} comments` })).toHaveAttribute('href', '/comments/1')

  expect(screen.getByText(`points`, { exact: false })).toHaveTextContent(
    `${story.score} points by ${story.by} about 1 hour ago | ${story.descendants} comments`
  )
})

test('should be able to render text when showText is true', () => {
  render(
    <BrowserRouter>
      <Story data={mockStoryWithText('3')} showText />
    </BrowserRouter>
  )
  expect(screen.getByTestId('dummy-paragraph')).toHaveTextContent('This is a paragraph')
})

test('should not render comment page link if there is no comment', () => {
  const story = mockNewStory('4')
  render(
    <BrowserRouter>
      <Story data={story} showText />
    </BrowserRouter>
  )
  expect(screen.queryByRole('link', { name: `${story.descendants} comments` })).not.toBeInTheDocument()
})

test('should render time only if type is job', () => {
  const story = { ...mockJob('5'), time: oneHourAgo}
  render(
    <BrowserRouter>
      <Story data={story} showText />
    </BrowserRouter>
  )
  expect(screen.getByText('about 1 hour ago')).toBeInTheDocument()
})

test('should render null if data is deleted', () => {
  const deletedStory = { ...mockStory('6'), deleted: true }
  render(
    <BrowserRouter>
      <Story data={deletedStory} />
    </BrowserRouter>
  )
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})

test('should render null if data is dead', () => {
  const deletedStory = { ...mockStory('6'), dead: true }
  render(
    <BrowserRouter>
      <Story data={deletedStory} />
    </BrowserRouter>
  )
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})