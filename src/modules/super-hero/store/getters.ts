import { GetterTree } from 'vuex';

import { State } from 'src/store';
import { SuperHeroState } from 'src/modules/super-hero/interfaces';

const getters: GetterTree<SuperHeroState, State> = {
  superHeroCount(state) {
    return state.superHeroes.length;
  },
};

export default getters;
