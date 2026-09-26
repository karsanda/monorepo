import { expect, test, vi } from 'vitest'
import { hn } from '~/lib/hn'
import { story } from '~/test/fixtures'
import { renderApp } from '~/test/render'
import { Submissions } from './submissions'

vi.mock('~/lib/hn', () => ({ hn: { getUserStories: vi.fn(), getUserComments: vi.fn() } }))

const mocked = vi.mocked(hn, true)
const firstStories = { items: [story(1)], page: 1, pageCount: 2 }
const buttonNamed = (screen: HTMLElement, name: string) =>
  Array.from(screen.querySelectorAll('button')).find((b) => b.textContent?.trim() === name)

test('loads more stories, and comments when their tab opens', async () => {
  mocked.getUserStories.mockResolvedValue({ items: [story(2)], page: 2, pageCount: 2 })
  mocked.getUserComments.mockResolvedValue({
    items: [{ id: 9, by: 'pg', text: 'a comment', time: 1, storyId: 1, storyTitle: 'Story 1' }],
    page: 1,
    pageCount: 1,
  })
  const { screen, userEvent } = await renderApp(
    <Submissions user="pg" firstStories={firstStories} />,
  )

  await userEvent(buttonNamed(screen, 'Load more')!, 'click')
  expect(mocked.getUserStories).toHaveBeenCalledWith('pg', 2)
  expect(screen.textContent).toContain('Story 2')
  expect(buttonNamed(screen, 'Load more')).toBeUndefined()

  await userEvent(buttonNamed(screen, 'Comments')!, 'click')
  expect(buttonNamed(screen, 'Comments')!.getAttribute('aria-pressed')).toBe('true')
  expect(screen.textContent).toContain('a comment')
  expect(mocked.getUserComments).toHaveBeenCalledWith('pg', 1)
})

test('reports a failed page', async () => {
  mocked.getUserStories.mockRejectedValue(new Error('offline'))
  const { screen, userEvent } = await renderApp(
    <Submissions user="pg" firstStories={firstStories} />,
  )

  await userEvent(buttonNamed(screen, 'Load more')!, 'click')
  expect(screen.querySelector('[role="alert"]')!.textContent).toBe(
    "Couldn't load more submissions.",
  )
})
