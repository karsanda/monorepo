import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './app.vue'
import Stories from './stories.vue'
import Comments from './comments.vue'
import Users from './users.vue'
import './style.css'

export const routes = [
  { path: '/', component: Stories, props: { type: 'topstories' } },
  { path: '/topstories', component: Stories, props: { type: 'topstories' } },
  { path: '/newstories', component: Stories, props: { type: 'newstories' } },
  { path: '/beststories', component: Stories, props: { type: 'beststories' } },
  { path: '/askstories', component: Stories, props: { type: 'askstories' } },
  { path: '/showstories', component: Stories, props: { type: 'showstories' } },
  { path: '/jobstories', component: Stories, props: { type: 'jobstories' } },
  { path: '/user/:userId', component: Users },
  { path: '/comments/:storyId', component: Comments },
]

const router = createRouter({ history: createWebHistory(), routes })
const app = createApp(App)

app.use(router)
app.mount('#app')
