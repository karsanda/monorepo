import { mountSuspended } from '@nuxt/test-utils/runtime'
import { expect, test } from 'vitest'
import { comment } from '~~/test/fixtures'
import CommentItem from './comment-item.vue'

test('collapses and expands a comment with its replies', async () => {
  const wrapper = await mountSuspended(CommentItem, {
    props: { comment: comment(1, 'sama', [comment(2, 'pg')]) },
  })

  const button = wrapper.get('button[aria-label="Collapse comment by sama"]')
  expect(button.attributes('aria-expanded')).toBe('true')
  expect(wrapper.text()).toContain('text by pg')

  await button.trigger('click')
  const toggled = wrapper.get('.collapse-button')
  expect(toggled.attributes('aria-expanded')).toBe('false')
  expect(toggled.attributes('aria-label')).toBe('Expand comment by sama')
  expect(wrapper.text()).not.toContain('text by sama')
  expect(wrapper.text()).not.toContain('text by pg')
})

test('shows deleted comments only when they have replies', async () => {
  const empty = await mountSuspended(CommentItem, { props: { comment: comment(1, null) } })
  expect(empty.find('article').exists()).toBe(false)

  const withReplies = await mountSuspended(CommentItem, {
    props: { comment: comment(2, null, [comment(3, 'pg')]) },
  })
  expect(withReplies.text()).toContain('[deleted]')
  expect(withReplies.find('[aria-label="Collapse comment by deleted user"]').exists()).toBe(true)
})
