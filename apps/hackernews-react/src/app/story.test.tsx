import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { mockAsk, mockJob, mockNewStory, mockStory } from '../utils'
import { subHours } from 'date-fns'
import Story from './story'

const oneHourAgo = Math.floor(subHours(new Date(), 1).getTime() / 1000)

test('should render story item correctly', () => {
  const story = { ...mockStory('1'), time: oneHourAgo }
  render(<Story data={story} />, { wrapper: BrowserRouter })

  expect(screen.getByRole('listitem')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: story.title })).toHaveAttribute('href', story.url)
  expect(screen.getByRole('link', { name: story.by })).toHaveAttribute('href', `/user/${story.by}`)
  expect(screen.getByRole('link', { name: `${story.descendants} comments` })).toHaveAttribute('href', '/comments/1')

  expect(screen.getByText(`points`, { exact: false })).toHaveTextContent(
    `${story.score} points by ${story.by} about 1 hour ago | ${story.descendants} comments`
  )
})

test('should be able to render without numbering', () => {
  render(<Story data={mockStory('2')} numbering={false} />, { wrapper: BrowserRouter })
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
})

test('should be able to render text when showText is true', () => {
  render(<Story data={mockAsk('3')} showText />, { wrapper: BrowserRouter })
  expect(screen.getByTestId('dummy-paragraph')).toHaveTextContent('This is a paragraph')
})

test('should not render comment page link if there is no comment', () => {
  const story = mockNewStory('4')
  render(<Story data={story} showText />, { wrapper: BrowserRouter })
  expect(screen.queryByRole('link', { name: `${story.descendants} comments` })).not.toBeInTheDocument()
})

test('should render time only if type is job', () => {
  const story = { ...mockJob('5'), time: oneHourAgo}
  render(<Story data={story} showText />, { wrapper: BrowserRouter })
  expect(screen.getByText('about 1 hour ago')).toBeInTheDocument()
})

test('should render null if data is deleted', () => {
  const deletedStory = { ...mockStory('6'), deleted: true }
  render(<Story data={deletedStory} />, { wrapper: BrowserRouter })
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})

test('should render null if data is dead', () => {
  const deletedStory = { ...mockStory('6'), dead: true }
  render(<Story data={deletedStory} />, { wrapper: BrowserRouter })
  expect(screen.queryByRole('article')).not.toBeInTheDocument()
})