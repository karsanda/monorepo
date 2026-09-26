import type { StoryType } from '@repo/hn-core'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Comments from './comments.vue'
import Stories from './stories.vue'
import Users from './users.vue'

const storiesRoute = (path: string, type: StoryType): RouteRecordRaw => ({
  path,
  component: Stories,
  props: { type },
})

export const routes: RouteRecordRaw[] = [
  storiesRoute('/', 'topstories'),
  storiesRoute('/topstories', 'topstories'),
  storiesRoute('/newstories', 'newstories'),
  storiesRoute('/beststories', 'beststories'),
  storiesRoute('/askstories', 'askstories'),
  storiesRoute('/showstories', 'showstories'),
  storiesRoute('/jobstories', 'jobstories'),
  { path: '/user/:userId', component: Users, props: true },
  { path: '/comments/:storyId', component: Comments, props: true },
]

export const createAppRouter = () => createRouter({ history: createWebHistory(), routes })
