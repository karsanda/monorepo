import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import useFetch from './hooks/useFetch'
import { mockStories } from './mocks/stories'
import Stories from './stories'

jest.mock('./hooks/useFetch.tsx', () => jest.fn())
const mockedUseFetch = useFetch as jest.Mock

test('should be able to render successfully', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/topstories') {
      return {
        state: 'fetched',
        data: mockStories(5)
      }
    }

    return { state: 'fetched' }
  })

  const { baseElement } = render(
    <BrowserRouter>
      <Stories type='topstories' />
    </BrowserRouter>
  )

  expect(baseElement).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'Next Page'})).not.toBeInTheDocument()
})

test('should be able to render next page link if data is > 30', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/topstories') {
      return {
        state: 'fetched',
        data: mockStories(35)
      }
    }

    return { state: 'fetched' }
  })

  render(
    <BrowserRouter>
      <Stories type='topstories' />
    </BrowserRouter>
  )

  expect(screen.getAllByRole('listitem').length).toEqual(30)
  expect(screen.getByRole('link', { name: 'Next Page'})).toHaveAttribute('href', '/topstories?page=2')
})

test('numbering should start from 31 in page 2', () => {
  mockedUseFetch.mockImplementation((url: string) => {
    if (url === '/topstories') {
      return {
        state: 'fetched',
        data: mockStories(40)
      }
    }

    return { state: 'fetched' }
  })

  render(
    <MemoryRouter initialEntries={['/?page=2']}>
      <Stories type='topstories' />
    </MemoryRouter>
  )

  expect(screen.getByRole('list')).toHaveAttribute('start', '31')
  expect(screen.queryByRole('link', { name: 'Next Page'})).not.toBeInTheDocument()
})