import { createStore } from 'vuex';

import supeheroesModule from 'src/modules/super-hero/store';
import { State } from 'src/store';
import { superHeroesState } from './test-super-hero-state';

const createVuexStore = (superHeroesInitState = { ...superHeroesState }) =>
  createStore<State>({
    modules: {
      superHeroes: {
        ...supeheroesModule,
        state: { ...superHeroesInitState },
      },
    },
  });

export default createVuexStore;
