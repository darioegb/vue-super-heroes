import { computed } from 'vue';
import { useStore } from 'vuex';
import { State } from '@/store';
import { SuperHero } from '../interfaces';
import { HttpStatus, RequestGrid } from '@/interfaces';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSuperHero = () => {
  const store = useStore<State>();

  return {
    //  State
    superHeroes: computed(() => store.state.superHeroes.superHeroes),
    selectedSuperHero: computed(
      () => store.state.superHeroes.selectedSuperHero,
    ),

    // Getters
    superHeroCount: computed<number>(
      () => store.getters['superHeroes/superHeroCount'],
    ),

    // Mutations
    setSelectedSuperHero: (superHero: SuperHero) =>
      store.commit('superHeroes/setSelectedSuperHero', superHero),

    // Actions
    getSuperHeroes: () => store.dispatch('superHeroes/getSuperHeroes'),
    getSuperHeroesPage: (requestGrid: RequestGrid<SuperHero>) =>
      store.dispatch('superHeroes/getSuperHeroesPage', requestGrid),
    updateSuperHero: (superHero: SuperHero): Promise<HttpStatus> =>
      store.dispatch('superHeroes/updateSuperHero', superHero),
    createSuperHero: (superHero: SuperHero): Promise<HttpStatus> =>
      store.dispatch('superHeroes/createSuperHero', superHero),
    deleteSuperHero: (id: string): Promise<HttpStatus> =>
      store.dispatch('superHeroes/deleteSuperHero', id),
  };
};
