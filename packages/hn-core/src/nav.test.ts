import { expect, test } from 'vitest'
import { HOME_STORY_TYPE, NAV_TABS, STORY_TYPE_TITLES } from './nav'
import { STORY_TYPES } from './types'

test('best stories are the home page', () => {
  expect(HOME_STORY_TYPE).toBe('beststories')
  expect(STORY_TYPE_TITLES[HOME_STORY_TYPE]).toBe('Best stories')
})

test('NAV_TABS covers every story type except the home page', () => {
  expect(NAV_TABS.map((tab) => tab.label)).toEqual(['Top', 'New', 'Ask', 'Show', 'Jobs'])
  expect(NAV_TABS.map((tab) => tab.type)).toEqual(
    STORY_TYPES.filter((type) => type !== HOME_STORY_TYPE),
  )
})
