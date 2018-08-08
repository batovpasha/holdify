import Vue from 'vue'
import Router from 'vue-router'
import Preloader from '@/components/Preloader'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Preloader',
      component: Preloader
    },
    {
      path: '/game',
      name: 'Game',
      component: Game
    }
  ]
})
