import { MutationTree } from 'vuex';

import { SuperHero, SuperHeroState } from 'src/modules/super-hero/interfaces';

const mutation: MutationTree<SuperHeroState> = {
  setSuperHeroes(state, payload: SuperHero[]) {
    state.superHeroes = [...payload];
    state.selectedSuperHero = undefined;
  },
  setSelectedSuperHero(state, payload: SuperHero) {
    state.selectedSuperHero = { ...payload };
  },
  addSuperHero(state, payload: SuperHero) {
    state.superHeroes = [...state.superHeroes, payload];
  },
  updateSuperHero(state, payload: SuperHero) {
    state.superHeroes.forEach(({ ...superHero }) =>
      superHero.id === payload.id ? payload : superHero
    );
  },
  deleteSuperHero(state, payload: string) {
    state.superHeroes = state.superHeroes.filter(
      ({ ...superHero }) => superHero.id !== payload
    );
    state.selectedSuperHero = undefined;
  },
};

export default mutation;
