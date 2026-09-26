import { expect, test } from 'vitest'
import { domainOf, isoTime, timeAgo } from './format'
import { NAV_TABS } from './nav'
import { isLive } from './types'

test('timeAgo', () => {
  const now = new Date('2023-12-02T09:00:00Z')
  expect(timeAgo(now.getTime() / 1000 - 5 * 3600, now)).toBe('about 5 hours ago')
})

test('isoTime', () => {
  expect(isoTime(1160418111)).toBe('2006-10-09T18:21:51.000Z')
})

test.each([
  ['https://www.example.com/a?b', 'example.com'],
  ['https://blog.example.co.uk', 'blog.example.co.uk'],
  [undefined, undefined],
  ['not a url', undefined],
])('domainOf(%j)', (url, expected) => {
  expect(domainOf(url)).toBe(expected)
})

test('isLive', () => {
  expect(isLive({ id: 1 } as { id: number; dead?: boolean })).toBe(true)
  expect(isLive({ dead: true })).toBe(false)
  expect(isLive({ deleted: true })).toBe(false)
  expect(isLive(null)).toBe(false)
})

test('NAV_TABS covers every story type except the home page', () => {
  expect(NAV_TABS.map((t) => t.type)).toEqual([
    'newstories',
    'beststories',
    'askstories',
    'showstories',
    'jobstories',
  ])
})
