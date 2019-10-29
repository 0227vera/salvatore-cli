import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/setting',
      name: 'Setting',
      component: resolve => require(['@/pages/setting'], resolve)
    },
    {
      path: '*',
      redirect: to => {
        return {
          name: 'Home'
        }
      }
    }
  ]
})
