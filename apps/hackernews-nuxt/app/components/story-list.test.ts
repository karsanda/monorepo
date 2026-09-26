import { HIDDEN_KEY, READ_KEY } from '@repo/hn-core'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { expect, test } from 'vitest'
import { story } from '~~/test/fixtures'
import StoryList from './story-list.vue'

test('shows the domain, comment count and job subtitles', async () => {
  const wrapper = await mountSuspended(StoryList, {
    props: {
      label: 'Stories',
      stories: [
        story(1, { url: 'https://www.example.com/post', descendants: 1 }),
        story(2, { descendants: 0 }),
        story(3, { type: 'job', url: 'https://jobs.example.com' }),
      ],
    },
  })
  const [first, second, job] = wrapper.findAll('li')

  expect(first!.text()).toContain('(example.com)')
  expect(first!.get('a[href="/comments/1"]').text()).toBe('1 comment')
  expect(second!.text()).toContain('discuss')
  expect(job!.text()).not.toContain('points')
})

test('hides stories and remembers read ones', async () => {
  const wrapper = await mountSuspended(StoryList, {
    props: { label: 'Stories', page: 2, stories: [story(10), story(11)], hideable: true },
  })
  expect(wrapper.get('ol').attributes('start')).toBe('31')

  await wrapper.get('a[href="/comments/11"]').trigger('click')
  expect(wrapper.findAll('article')[1]!.classes()).toContain('story--read')
  expect(JSON.parse(localStorage.getItem(READ_KEY)!)).toEqual([11])

  await wrapper.findAll('button.link-button')[0]!.trigger('click')
  expect(wrapper.findAll('li')).toHaveLength(1)
  expect(JSON.parse(localStorage.getItem(HIDDEN_KEY)!)).toEqual([10])
})
