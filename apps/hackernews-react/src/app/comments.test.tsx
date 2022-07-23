import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Comments from './comments'
import useFetch from '../hooks/useFetch'
import { mockComment, mockStoryWithText } from '../utils'

jest.mock('../hooks/useFetch.tsx', () => jest.fn())
const mockedUseFetch = useFetch as jest.Mock

function renderCommentsPage(itemid: string) {
  return render(
    <MemoryRouter initialEntries={[`/comments/${itemid}`]}>
      <Routes>
        <Route path='/comments/:itemid' element={<Comments />} />
      </Routes>
    </MemoryRouter>
  )
}

test('should be able to render successfully', () => {
  mockedUseFetch.mockReturnValueOnce({ state: 'fetched' })

  const { baseElement } = renderCommentsPage('777')

  expect(baseElement).toBeTruthy()
  expect(screen.getByTestId('article-shimmer')).toBeInTheDocument()
})

test('should render story with text and comment', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === 'item/777') {
      return {
        state: 'fetched',
        data: {
          ...mockStoryWithText('777'),
          descendants: 1,
          kids: [555]
        }
      }
    }

    if (url === 'item/444') {
      return { state: 'fetched' }
    }

    if (url === 'item/555') {
      return {
        state: 'fetched',
        data: {
          ...mockComment('555', '777'),
          kids: undefined
        }
      }
    }

    return { state: 'fetched' }
  })

  renderCommentsPage('777')
  expect(screen.getByTestId('dummy-paragraph')).toHaveTextContent('This is a paragraph')
})

test('it should render shimmer on comment if data is undefined', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === 'item/777') {
      return {
        state: 'fetched',
        data: {
          ...mockStoryWithText('777'),
          descendants: 1,
          kids: [444]
        }
      }
    }

    return { state: 'fetched' }
  })

  renderCommentsPage('777')
  expect(screen.getByTestId('article-shimmer')).toBeInTheDocument()
})