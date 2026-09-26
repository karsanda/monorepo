import type { ThreadComment } from '@repo/hn-core'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Comment from './comment.svelte'

const comment = (id: number, by: string | null, kids: ThreadComment[] = []): ThreadComment => ({
  id,
  by,
  text: by ? `text by ${by}` : null,
  time: 1_700_000_000,
  parent: 0,
  kids,
})

test('collapses and expands a comment with its replies', async () => {
  render(Comment, { comment: comment(1, 'sama', [comment(2, 'pg')]) })

  const button = screen.getByRole('button', { name: 'Collapse comment by sama' })
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText('text by pg')).toBeInTheDocument()

  await userEvent.click(button)
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(button).toHaveAccessibleName('Expand comment by sama')
  expect(screen.queryByText('text by sama')).not.toBeInTheDocument()
  expect(screen.queryByText('text by pg')).not.toBeInTheDocument()
})

test('shows deleted comments only when they have replies', () => {
  const { container } = render(Comment, { comment: comment(1, null) })
  expect(container.querySelector('article')).toBeNull()

  render(Comment, { comment: comment(2, null, [comment(3, 'pg')]) })
  expect(screen.getByText('[deleted]')).toBeInTheDocument()
})
