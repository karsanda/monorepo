import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, expect, test, vi } from 'vitest'
import { Header } from './header'

vi.mock('next/navigation', () => ({
  usePathname: () => '/newstories',
  useSearchParams: () => new URLSearchParams(),
}))
vi.mock('next/form', () => ({
  default: ({ children, prefetch: _, ...props }: { children: ReactNode; prefetch?: boolean }) => (
    <form {...props}>{children}</form>
  ),
}))

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
  return () => vi.unstubAllGlobals()
})

test('marks the current tab', () => {
  render(<Header />)
  expect(screen.getByRole('link', { name: 'New' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('link', { name: 'Best' })).not.toHaveAttribute('aria-current')
})

test('toggles the theme and saves it in a cookie', async () => {
  render(<Header savedTheme="light" />)

  await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(document.cookie).toContain('theme=dark')
  expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
})
