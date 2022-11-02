import { ID_KEY } from 'src/globals';
import { BaseLayout } from 'src/layouts';

const getDetailRoute = (): Promise<unknown> =>
  import('src/modules/super-hero/pages/SuperHeroDetail/SuperHeroDetail.vue');

export default {
  name: 'superheroes',
  component: BaseLayout,
  children: [
    {
      path: '',
      name: 'SuperHeroGrid',
      component: (): Promise<unknown> =>
        import('src/modules/super-hero/pages/SuperHeroGrid/SuperHeroGrid.vue'),
    },
    {
      path: 'detail',
      name: 'SuperHeroNew',
      component: getDetailRoute,
    },
    {
      path: `detail/:${ID_KEY as string}`,
      name: 'SuperHeroDetail',
      component: getDetailRoute,
      props: (
        route: Record<string, Record<string, string>>,
      ): Record<string, string | boolean> => ({
        id: route.params.id,
        view: route.query.view === 'true',
      }),
    },
  ],
};
