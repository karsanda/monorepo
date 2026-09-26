import { render, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { comment } from '~/test/fixtures'
import { Comment } from './comment'

test('collapses and expands a comment with its replies', async () => {
  render(() => <Comment comment={comment(1, 'sama', [comment(2, 'pg')])} />)

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
  const { container } = render(() => <Comment comment={comment(1, null)} />)
  expect(container.querySelector('article')).toBeNull()

  render(() => <Comment comment={comment(2, null, [comment(3, 'pg')])} />)
  expect(screen.getByText('[deleted]')).toBeInTheDocument()
})
