import { Module } from 'vuex';

import { State } from 'src/store';
import state from './state';
import actions from './actions';
import mutations from './mutations';
import { SuperHeroState } from 'src/modules/super-hero/interfaces';

const supeheroesModule: Module<SuperHeroState, State> = {
  namespaced: true,
  actions,
  mutations,
  state,
};

export default supeheroesModule;
