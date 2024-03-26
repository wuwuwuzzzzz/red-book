import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '首页',
      component: () => import('@/views/Home/index.vue')
    },
    {
      path: '/video',
      name: '视频',
      component: () => import('@/views/Video/index.vue')
    },
    {
      path: '/publish',
      name: '发布',
      component: () => import('@/views/Publish/index.vue')
    },
    {
      path: '/message',
      name: '消息',
      component: () => import('@/views/Message/index.vue')
    },
    {
      path: '/user',
      name: '我',
      component: () => import('@/views/User/index.vue')
    }
  ]
})

export default router
