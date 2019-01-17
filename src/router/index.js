import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login'
import Home from '@/views/Home'
import Welcome from '@/views/welcome/Welcome'
import User from '@/views/user/User'

import Rights from '@/views/right/Rights'
import Roles from '@/views/right/Roles'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      // redirect: { name: 'welcome' },
      redirect: { path: 'welcome' },
      children: [
        {
          path: 'Welcome',
          name: 'welcome',
          component: Welcome
        },
        {
          path: 'Users',
          name: 'users',
          component: User
        },
        {
          path: 'Rights',
          name: 'rights',
          component: Rights
        },
        {
          path: 'Roles',
          name: 'roles',
          component: Roles
        }
      ]
    }
  ]
})
