import { mount } from '@vue/test-utils'
import Info from './info.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../../main'

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

beforeEach(() => {
  vi.useFakeTimers()

  const date = new Date(2023, 11, 2, 16)
  vi.setSystemTime(date)
})

afterEach(() => {
  vi.useRealTimers()
})

test('should render created time only if story type is job', () => {
  const wrapper = mount(Info, {
    global: {
      plugins: [router]
    },
    props: {
      story: {
        time: 1701489130,
        type: 'job',
        by: '',
        id: '',
        score: 0,
        title: ''
      }
    }
  })

  expect(wrapper.text()).toContain('about 5 hours ago')
})

test('should render story point, user, created time, and # of comment if story.descendants exists', () => {
  const wrapper = mount(Info, {
    global: {
      plugins: [router]
    },
    props: {
      story: {
        by: 'dummy user',
        descendants: 32,
        score: 320,
        time: 1701489130,
        type: 'story',
        id: '',
        title: ''
      }
    }
  })

  expect(wrapper.text()).toContain('320 points by dummy user about 5 hours ago | 32 comments')
})

test('should render story point, user, create time if story.descendants exists', () => {
  const wrapper = mount(Info, {
    global: {
      plugins: [router]
    },
    props: {
      story: {
        by: 'dummy user',
        score: 320,
        time: 1701489130,
        type: 'story',
        id: '',
        title: ''
      }
    }
  })

  expect(wrapper.text()).toContain('320 points by dummy user about 5 hours ago')
})

