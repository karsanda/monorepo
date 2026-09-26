import { afterEach, expect, test, vi } from 'vitest'
import { loadIds, parseTheme, saveIds, themeCookie, themeFromCookieHeader } from './prefs'

afterEach(() => {
  vi.unstubAllGlobals()
})

function stubStorage() {
  const data = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
  })
  return data
}

test('saves and loads id sets', () => {
  stubStorage()
  saveIds('k', new Set([1, 2, 3]))
  expect(loadIds('k')).toEqual(new Set([1, 2, 3]))
})

test('ignores missing, corrupt or blocked storage', () => {
  expect(loadIds('k')).toEqual(new Set())

  stubStorage().set('k', '{not json')
  expect(loadIds('k')).toEqual(new Set())

  vi.stubGlobal('localStorage', {
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('blocked')
    },
  })
  expect(loadIds('k')).toEqual(new Set())
  expect(() => saveIds('k', [1])).not.toThrow()
})

test('keeps only the newest ids', () => {
  const data = stubStorage()
  saveIds(
    'k',
    Array.from({ length: 2500 }, (_, i) => i),
  )
  const saved = JSON.parse(data.get('k')!) as number[]
  expect(saved).toHaveLength(2000)
  expect(saved[0]).toBe(500)
})

test('theme helpers', () => {
  expect(parseTheme('dark')).toBe('dark')
  expect(parseTheme('blue')).toBeUndefined()
  expect(themeCookie('light')).toMatch(/^theme=light; path=\//)
})

test('reads the theme from a Cookie header', () => {
  expect(themeFromCookieHeader('a=1; theme=dark; b=2')).toBe('dark')
  expect(themeFromCookieHeader('theme=light')).toBe('light')
  expect(themeFromCookieHeader('mytheme=dark')).toBeUndefined()
  expect(themeFromCookieHeader('theme=purple')).toBeUndefined()
  expect(themeFromCookieHeader(null)).toBeUndefined()
})
