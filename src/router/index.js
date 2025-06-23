// createRouter 路由实例
// createWebHistory history模式路由

import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import Category from '@/views/Category/index.vue'
import SubCategory from '@/views/SubCategory/index.vue'
import Detail from '@/views/Detail/index.vue'
import CartList from '@/views/CartList/index.vue'
import Account from '@/views/Account/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      component:Layout,
      children:[
        {
          path:'',
          component:Home
        },
        {
          path:'/category/:id',
          component:Category
        },
        {
          path:'/category/sub/:id',
          component:SubCategory
        },
        {
          path:'/detail/:id',
          component:Detail
        },
        {
          path:'/cartList',
          component:CartList
        },
        {
          path:'/account',
          component:Account
        }
      ]
    },
    {
      path:'/login',
      component:Login
    }
  ],
  // 路由滚动行为定制
  scrollBehavior(to, from, savedPosition) {
    // savedPosition 是一个对象，包含了滚动位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router
