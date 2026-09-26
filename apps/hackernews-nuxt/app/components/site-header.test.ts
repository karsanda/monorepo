import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, expect, test, vi } from 'vitest'
import SiteHeader from './site-header.vue'

beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
  return () => vi.unstubAllGlobals()
})

test('marks the current tab', async () => {
  const wrapper = await mountSuspended(SiteHeader, { route: '/newstories' })
  expect(wrapper.get('a[href="/newstories"]').attributes('aria-current')).toBe('page')
  expect(wrapper.get('a[href="/beststories"]').attributes('aria-current')).toBeUndefined()
})

test('toggles the theme and saves it in a cookie', async () => {
  const wrapper = await mountSuspended(SiteHeader)
  const toggle = wrapper.get('.theme-toggle')
  expect(toggle.text()).toContain('Switch to dark theme')

  await toggle.trigger('click')
  expect(toggle.text()).toContain('Switch to light theme')
  expect(document.cookie).toContain('theme=dark')
})
