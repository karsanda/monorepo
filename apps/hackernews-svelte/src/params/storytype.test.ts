import { expect, test } from 'vitest'
import { match } from './storytype'

test('matches story types only', () => {
  expect(match('jobstories')).toBe(true)
  expect(match('favicon.ico')).toBe(false)
  expect(match('comments')).toBe(false)
})
