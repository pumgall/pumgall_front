import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Main from '../views/Main.vue';
import SongList from '../views/SongList.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', name: 'Main', component: Main },
  { path: '/songlist', name: 'SongList', component: SongList },
  { path: '*', redirect: '/' },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
