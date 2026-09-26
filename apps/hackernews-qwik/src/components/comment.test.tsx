import { expect, test } from 'vitest'
import { comment } from '~/test/fixtures'
import { renderApp } from '~/test/render'
import { Comment } from './comment'

test('collapses and expands a comment with its replies', async () => {
  const { screen, userEvent } = await renderApp(
    <Comment comment={comment(1, 'sama', [comment(2, 'pg')])} />,
  )

  const button = () => screen.querySelector('.collapse-button')!
  expect(button().getAttribute('aria-label')).toBe('Collapse comment by sama')
  expect(button().getAttribute('aria-expanded')).toBe('true')
  expect(screen.textContent).toContain('text by pg')

  await userEvent('.collapse-button', 'click')
  expect(button().getAttribute('aria-expanded')).toBe('false')
  expect(button().getAttribute('aria-label')).toBe('Expand comment by sama')
  expect(screen.textContent).not.toContain('text by sama')
  expect(screen.textContent).not.toContain('text by pg')
})

test('shows deleted comments only when they have replies', async () => {
  const empty = await renderApp(<Comment comment={comment(1, null)} />)
  expect(empty.screen.querySelector('article')).toBeFalsy()

  const withReplies = await renderApp(<Comment comment={comment(2, null, [comment(3, 'pg')])} />)
  expect(withReplies.screen.textContent).toContain('[deleted]')
})
