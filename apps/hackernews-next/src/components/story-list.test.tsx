import { HIDDEN_KEY, READ_KEY } from '@repo/hn-core'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { story } from '@/test/fixtures'
import { StoryList } from './story-list'

test('shows the domain, comment count and job subtitles', () => {
  render(
    <StoryList
      label="Stories"
      stories={[
        story(1, { url: 'https://www.example.com/post', descendants: 1 }),
        story(2, { descendants: 0 }),
        story(3, { type: 'job', url: 'https://jobs.example.com' }),
      ]}
    />,
  )
  const [first, second, job] = screen.getAllByRole('listitem')

  expect(within(first!).getByText('(example.com)')).toBeInTheDocument()
  expect(within(first!).getByRole('link', { name: '1 comment' })).toHaveAttribute(
    'href',
    '/comments/1',
  )
  expect(within(second!).getByRole('link', { name: 'discuss' })).toBeInTheDocument()
  expect(within(job!).queryByText(/points/)).not.toBeInTheDocument()
})

test('hides stories and remembers read ones', async () => {
  render(<StoryList label="Stories" page={2} stories={[story(10), story(11)]} hideable />)
  const list = screen.getByRole('list', { name: 'Stories' })
  expect(list).toHaveAttribute('start', '31')

  await userEvent.click(screen.getByRole('link', { name: 'Story 11' }))
  expect(screen.getByRole('link', { name: 'Story 11' }).closest('article')).toHaveClass(
    'story--read',
  )
  expect(JSON.parse(localStorage.getItem(READ_KEY)!)).toEqual([11])

  await userEvent.click(within(list).getAllByRole('button', { name: /^hide\s*story$/ })[0]!)
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(JSON.parse(localStorage.getItem(HIDDEN_KEY)!)).toEqual([10])
})
