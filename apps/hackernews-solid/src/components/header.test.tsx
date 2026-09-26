import { createMemoryHistory, MemoryRouter, Route } from '@solidjs/router'
import { render, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'
import { Header } from './header'

function renderAt(path: string) {
  const history = createMemoryHistory()
  history.set({ value: path })
  return render(() => (
    <MemoryRouter history={history}>
      <Route path="*" component={Header} />
    </MemoryRouter>
  ))
}

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
  return () => vi.unstubAllGlobals()
})

test('marks the current tab', async () => {
  renderAt('/newstories')
  expect(await screen.findByRole('link', { name: 'New' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('link', { name: 'Top' })).not.toHaveAttribute('aria-current')
})

test('toggles the theme and saves it in a cookie', async () => {
  renderAt('/')

  await userEvent.click(await screen.findByRole('button', { name: 'Switch to dark theme' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(document.cookie).toContain('theme=dark')
  expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
})
