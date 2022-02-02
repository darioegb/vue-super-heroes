import { BaseLayout } from '@/layouts';

const getDetailRoute = (): Promise<typeof import('SuperHeroDetail.vue')> =>
  import('@/modules/super-hero/views/SuperHeroDetail/SuperHeroDetail.vue');

export default {
  name: 'superheroes',
  component: BaseLayout,
  children: [
    {
      path: '',
      name: 'SuperHeroGrid',
      component: (): Promise<typeof import('SuperHeroGrid.vue')> =>
        import('@/modules/super-hero/views/SuperHeroGrid/SuperHeroGrid.vue'),
    },
    {
      path: 'detail',
      name: 'SuperHeroNew',
      component: getDetailRoute,
    },
    {
      path: 'detail/:id',
      name: 'SuperHeroDetail',
      component: getDetailRoute,
      props: (route: { params: { id: string } }): { id: string } => ({
        id: route.params.id,
      }),
    },
  ],
};
