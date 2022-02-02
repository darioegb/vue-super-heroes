import { createStore } from 'vuex';

import supeheroesModule from '@/modules/super-hero/store';
import { SuperHeroState } from '@/modules/super-hero/interfaces';
export interface State {
  superHeroes: SuperHeroState;
}

export default createStore<State>({
  modules: {
    superHeroes: supeheroesModule,
  },
});
