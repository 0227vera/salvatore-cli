import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: resolve => require(['@/pages/welcome'], resolve),
      meta: {
        activeIndex: 0
      }
    }
  ]
})
