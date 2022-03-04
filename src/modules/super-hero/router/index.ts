import { ObjectIndexer } from '@/interfaces';
import { BaseLayout } from '@/layouts';

const getDetailRoute = (): Promise<unknown> =>
  import('@/modules/super-hero/pages/SuperHeroDetail/SuperHeroDetail.vue');

export default {
  name: 'superheroes',
  component: BaseLayout,
  children: [
    {
      path: '',
      name: 'SuperHeroGrid',
      component: (): Promise<unknown> =>
        import('@/modules/super-hero/pages/SuperHeroGrid/SuperHeroGrid.vue'),
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
      props: (
        route: ObjectIndexer<ObjectIndexer<string>>,
      ): ObjectIndexer<string | boolean> => ({
        id: route.params.id,
        view: route.query.view === 'true',
      }),
    },
  ],
};
