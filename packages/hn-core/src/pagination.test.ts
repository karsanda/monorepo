import { describe, expect, test } from 'vitest'
import { firstItemIndex, getPage, pageCount, paginateData, PAGE_SIZE } from './pagination'

describe('getPage', () => {
  test.each([
    ['3', 3],
    [null, 1],
    [undefined, 1],
    ['', 1],
    ['abc', 1],
    ['0', 1],
    ['-2', 1],
  ])('getPage(%j) -> %i', (input, expected) => {
    expect(getPage(input)).toBe(expected)
  })
})

describe('paginateData', () => {
  const data = Array.from({ length: 75 }, (_, i) => i + 1)

  test('returns the first page', () => {
    expect(paginateData(data, 1)).toEqual(data.slice(0, PAGE_SIZE))
  })

  test('returns a partial last page', () => {
    expect(paginateData(data, 3)).toEqual([61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75])
  })

  test('returns an empty array past the end', () => {
    expect(paginateData(data, 4)).toEqual([])
  })
})

test('pageCount', () => {
  expect(pageCount(0)).toBe(0)
  expect(pageCount(30)).toBe(1)
  expect(pageCount(31)).toBe(2)
})

test('firstItemIndex', () => {
  expect(firstItemIndex(1)).toBe(1)
  expect(firstItemIndex(2)).toBe(31)
})
