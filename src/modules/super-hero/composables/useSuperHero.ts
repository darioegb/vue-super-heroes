import { computed } from 'vue';
import { useStore } from 'vuex';

import { State, storeKey } from 'src/store';
import {
  SuperHero,
  SuperHeroResponse,
} from 'src/modules/super-hero/interfaces';
import { HttpStatus, RequestGrid } from 'src/interfaces';

export const useSuperHero = (): SuperHeroResponse => {
  const store = useStore<State>(storeKey);

  return {
    //  State
    superHeroes: computed(() => store.state.superHeroes.superHeroes),
    selectedSuperHero: computed(
      () => store.state.superHeroes.selectedSuperHero
    ),

    // Mutations
    setSelectedSuperHero: (superHero: SuperHero) =>
      store.commit('superHeroes/setSelectedSuperHero', superHero),

    // Actions
    getSuperHeroesPage: (requestGrid: RequestGrid<SuperHero>) =>
      store.dispatch('superHeroes/getSuperHeroesPage', requestGrid),
    updateSuperHero: (superHero: SuperHero): Promise<HttpStatus> =>
      store.dispatch(
        'superHeroes/updateSuperHero',
        superHero
      ) as Promise<HttpStatus>,
    createSuperHero: (superHero: SuperHero): Promise<HttpStatus> =>
      store.dispatch(
        'superHeroes/createSuperHero',
        superHero
      ) as Promise<HttpStatus>,
    deleteSuperHero: (id: string): Promise<HttpStatus> =>
      store.dispatch('superHeroes/deleteSuperHero', id) as Promise<HttpStatus>,
  };
};
