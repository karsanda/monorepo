import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { hn } from '@/lib/hn'
import { story } from '@/test/fixtures'
import { Submissions } from './submissions'

vi.mock('@/lib/hn', () => ({ hn: { getUserStories: vi.fn(), getUserComments: vi.fn() } }))

const mocked = vi.mocked(hn, true)

test('loads more stories, and comments when their tab opens', async () => {
  mocked.getUserStories.mockResolvedValue({ items: [story(2)], page: 2, pageCount: 2 })
  mocked.getUserComments.mockResolvedValue({
    items: [{ id: 9, by: 'pg', text: 'a comment', time: 1, storyId: 1, storyTitle: 'Story 1' }],
    page: 1,
    pageCount: 1,
  })
  render(<Submissions user="pg" firstStories={{ items: [story(1)], page: 1, pageCount: 2 }} />)

  await userEvent.click(screen.getByRole('button', { name: 'Load more' }))
  expect(mocked.getUserStories).toHaveBeenCalledWith('pg', 2)
  expect(await screen.findByRole('link', { name: 'Story 2' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Comments' }))
  expect(screen.getByRole('button', { name: 'Comments' })).toHaveAttribute('aria-pressed', 'true')
  expect(await screen.findByText('a comment')).toBeInTheDocument()
  expect(mocked.getUserComments).toHaveBeenCalledWith('pg', 1)
})

test('reports a failed page', async () => {
  mocked.getUserStories.mockRejectedValue(new Error('offline'))
  render(<Submissions user="pg" firstStories={{ items: [story(1)], page: 1, pageCount: 2 }} />)

  await userEvent.click(screen.getByRole('button', { name: 'Load more' }))
  expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load more submissions.")
})
