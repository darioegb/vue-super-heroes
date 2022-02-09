import { ActionTree } from 'vuex';

import { State } from '@/store';
import { SuperHero, SuperHeroState } from '@/modules/super-hero/interfaces';
import { useAxios } from '@/hooks';
import { HttpConfig, RequestGrid } from '@/interfaces';

const actions: ActionTree<SuperHeroState, State> = {
  async getSuperHeroes({ commit }) {
    const { data, exec } = useAxios<SuperHero>('superHeroes', 'get');
    await exec();

    if (!data) {
      commit('setSuperHeroes', []);
      return;
    }

    commit('setSuperHeroes', data.value);
  },

  async getSuperHeroesPage({ commit }, payload: RequestGrid<SuperHero>) {
    const httpConfig: HttpConfig = { params: {} };
    const {
      pagination: { descending, page, rowsPerPage, sortBy },
      filter,
    } = payload;
    httpConfig.params = {
      _page: page,
      _limit: rowsPerPage,
      _sort: sortBy,
      _order: descending ? 'desc' : 'asc',
    };

    if (filter && filter.length > 0) {
      httpConfig.params.name_like = filter;
    }

    const { data, count, exec } = useAxios<SuperHero>(
      'superHeroes',
      'get',
      undefined,
      httpConfig,
    );
    await exec();

    if (!data) {
      commit('setSuperHeroes', []);
      return;
    }

    commit('setSuperHeroes', data.value);
    return count?.value;
  },

  async updateSuperHero({ commit }, payload: SuperHero) {
    const { data, exec } = useAxios<SuperHero>(
      `superHeroes/${payload.id}`,
      'put',
      payload,
    );
    await exec();

    commit('updateSuperHero', { ...(data && data.value) });
  },

  async createSuperHero({ commit }, payload: SuperHero) {
    const { exec } = useAxios<SuperHero>('superHeroes', 'post', payload);
    await exec();

    commit('addSuperHero', payload);
  },

  async deleteSuperHero({ commit }, payload: string) {
    const { exec } = useAxios<SuperHero>(`superHeroes/${payload}`, 'delete');
    await exec();
    commit('deleteSuperHero', payload);
  },
};

export default actions;
