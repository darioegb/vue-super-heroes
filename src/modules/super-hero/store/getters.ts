import { GetterTree } from 'vuex';

import { State } from '@/store';
import { SuperHeroState } from '@/modules/super-hero/interfaces';

const getters: GetterTree<SuperHeroState, State> = {
  superHeroCount(state) {
    return state.superHeroes.length;
  },
};

export default getters;
