import { RouteRecordRaw } from 'vue-router';

import superHeroRouter from 'src/modules/super-hero/router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: 'superheroes',
  },
  {
    path: '/superheroes',
    ...superHeroRouter,
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
