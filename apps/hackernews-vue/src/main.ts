import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './app.vue'
import Stories from './stories.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
})

const app = createApp(App)
app.use(router)
app.mount('#app')
