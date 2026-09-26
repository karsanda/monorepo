import { expect, test } from 'vitest'
import { itemURI, restURL, typeURI, userURI } from './api'
import { isStoryType } from './types'

test('builds Firebase paths', () => {
  expect(itemURI(8863)).toBe('/item/8863')
  expect(typeURI('askstories')).toBe('/askstories')
  expect(userURI('pg')).toBe('/user/pg')
})

test('builds REST URLs', () => {
  expect(restURL(itemURI(1))).toBe('https://hacker-news.firebaseio.com/v0/item/1.json')
})

test('isStoryType', () => {
  expect(isStoryType('jobstories')).toBe(true)
  expect(isStoryType('favicon.ico')).toBe(false)
})

test('isStoryType rejects inherited keys', () => {
  expect(isStoryType('toString')).toBe(false)
})
