import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import superHeroRouter from '@/modules/super-hero/router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'superheroes',
  },
  {
    path: '/superheroes',
    ...superHeroRouter,
  },
  { path: '/:pathMatch(.*)*', redirect: 'superheroes' },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
