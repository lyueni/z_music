import Vue from 'vue'
import Router from 'vue-router'
import recommendationIndex from '@/views/recommendation/';
import songIndex from '@/views/song/';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'recommendation Index',
      component: recommendationIndex
    },
    {
      path: '/song/:id',
      name: 'play song',
      component: songIndex
    },
  ]
})
