import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import { story } from '~~/test/fixtures'
import { hn } from '../utils/hn'
import UserSubmissions from './user-submissions.vue'

vi.mock('../utils/hn', () => ({ hn: { getUserStories: vi.fn(), getUserComments: vi.fn() } }))

const mocked = vi.mocked(hn, true)
const firstStories = { items: [story(1)], page: 1, pageCount: 2 }

test('loads more stories, and comments when their tab opens', async () => {
  mocked.getUserStories.mockResolvedValue({ items: [story(2)], page: 2, pageCount: 2 })
  mocked.getUserComments.mockResolvedValue({
    items: [{ id: 9, by: 'pg', text: 'a comment', time: 1, storyId: 1, storyTitle: 'Story 1' }],
    page: 1,
    pageCount: 1,
  })
  const wrapper = await mountSuspended(UserSubmissions, { props: { user: 'pg', firstStories } })

  await wrapper
    .findAll('button')
    .find((b) => b.text() === 'Load more')!
    .trigger('click')
  await flushPromises()
  expect(mocked.getUserStories).toHaveBeenCalledWith('pg', 2)
  expect(wrapper.text()).toContain('Story 2')
  expect(wrapper.findAll('button').some((b) => b.text() === 'Load more')).toBe(false)

  const tab = wrapper.findAll('button').find((b) => b.text() === 'Comments')!
  await tab.trigger('click')
  await flushPromises()
  expect(tab.attributes('aria-pressed')).toBe('true')
  expect(wrapper.text()).toContain('a comment')
  expect(mocked.getUserComments).toHaveBeenCalledWith('pg', 1)
})

test('reports a failed page', async () => {
  mocked.getUserStories.mockRejectedValue(new Error('offline'))
  const wrapper = await mountSuspended(UserSubmissions, { props: { user: 'pg', firstStories } })

  await wrapper
    .findAll('button')
    .find((b) => b.text() === 'Load more')!
    .trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="alert"]').text()).toBe("Couldn't load more submissions.")
})
