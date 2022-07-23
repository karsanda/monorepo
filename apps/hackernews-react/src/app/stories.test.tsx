import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import Stories from './stories'
import { mockStories, mockStory } from '../utils'
import useFetch from '../hooks/useFetch'

jest.mock('../hooks/useFetch.tsx', () => jest.fn())
const mockedUseFetch = useFetch as jest.Mock

test('should be able to render successfully', () => {
  mockedUseFetch
    .mockReturnValueOnce({ loading: 'fetched', data: mockStories(1) })
    .mockReturnValueOnce({ loading: 'fetched' })

  const { baseElement } = render(<Stories type='topstories' />, { wrapper: BrowserRouter })

  expect(baseElement).toBeTruthy()
  expect(screen.getByTestId('list-item-shimmer')).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'Next Page'})).not.toBeInTheDocument()
})

test('should be able to render next page link if data is > 30', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === 'topstories') {
      return { loading: 'fetched', data: mockStories(35) }
    }

    if (url.includes('item/')) {
      const id = url.split('/')[1]
      return { loading: 'fetched', data: mockStory(id) }
    }

    return {}
  })

  render(<Stories type='topstories' />, { wrapper: BrowserRouter })
  expect(screen.getAllByRole('listitem').length).toEqual(30)
  expect(screen.getByRole('link', { name: 'Next Page'})).toHaveAttribute('href', '/topstories?page=2')
})

test('numbering should start from 31 in page 2', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === 'topstories') {
      return { loading: 'fetched', data: mockStories(40) }
    }

    if (url.includes('item/')) {
      const id = url.split('/')[1]
      return { loading: 'fetched', data: mockStory(id) }
    }

    return {}
  })

  render(
    <MemoryRouter initialEntries={['/?page=2']}>
      <Stories type='topstories' />
    </MemoryRouter>
  )

  expect(screen.getByRole('list')).toHaveAttribute('start', '31')
  expect(screen.queryByRole('link', { name: 'Next Page'})).not.toBeInTheDocument()
})