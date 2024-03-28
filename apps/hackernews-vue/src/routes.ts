import Stories from './stories.vue'

const routes = [
  { path: '/', component: Stories, props: { type: 'topstories' } },
  { path: '/topstories', component: Stories, props: { type: 'topstories' } },
  { path: '/newstories', component: Stories, props: { type: 'newstories' } },
  { path: '/beststories', component: Stories, props: { type: 'beststories' } },
  { path: '/askstories', component: Stories, props: { type: 'askstories' } },
  { path: '/showstories', component: Stories, props: { type: 'showstories' } },
  { path: '/jobstories', component: Stories, props: { type: 'jobstories' } },
  { path: '/user/:userId', component: { template: '<div />' } },
  { path: '/comments/:storyId', component: { template: '<div />' } },
]

export { routes }