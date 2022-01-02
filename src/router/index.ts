import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Main from '../views/Main.vue';
import SongList from '../views/SongList.vue';
import UcsList from '../views/UcsList.vue';


Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/', name: 'Main', component: Main },
  { path: '/songlist', name: 'SongList', component: SongList },
  { path: '/ucslist', name: 'UcsList', component: UcsList },
  { path: '*', redirect: '/' },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
