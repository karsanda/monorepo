import { HIDDEN_KEY } from '@repo/hn-core'
import { expect, test, vi } from 'vitest'
import { story } from '~/test/fixtures'
import { renderApp } from '~/test/render'
import { StoryList } from './story-list'

test('shows the domain, comment count and job subtitles', async () => {
  const { screen } = await renderApp(
    <StoryList
      label="Stories"
      stories={[
        story(1, { url: 'https://www.example.com/post', descendants: 1 }),
        story(2, { descendants: 0 }),
        story(3, { type: 'job', url: 'https://jobs.example.com' }),
      ]}
    />,
  )
  const [first, second, job] = Array.from(screen.querySelectorAll('li'))

  expect(first!.textContent).toContain('(example.com)')
  expect(first!.querySelector('a[href="/comments/1"]')!.textContent).toBe('1 comment')
  expect(second!.textContent).toContain('discuss')
  expect(job!.textContent).not.toContain('points')
})

test('hides stories and saves them', async () => {
  const storage = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  })
  const { screen, userEvent } = await renderApp(
    <StoryList label="Stories" page={2} stories={[story(10), story(11)]} hideable />,
  )
  expect(screen.querySelector('ol')!.getAttribute('start')).toBe('31')

  await userEvent('li:first-child .link-button', 'click')
  expect(screen.querySelectorAll('li')).toHaveLength(1)
  expect(JSON.parse(storage.get(HIDDEN_KEY)!)).toEqual([10])
  vi.unstubAllGlobals()
})
