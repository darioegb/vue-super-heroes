import { ActionTree } from 'vuex';

import { State } from '@/store';
import { SuperHero, SuperHeroState } from '@/modules/super-hero/interfaces';
import { useAxios } from '@/composables';
import { HttpConfig, HttpStatus, RequestGrid } from '@/interfaces';

const resourceUrl = 'superHeroes';

const actions: ActionTree<SuperHeroState, State> = {
  async getSuperHeroes({ commit }) {
    const { data, isError, exec } = useAxios<SuperHero>({
      url: resourceUrl,
      method: 'get',
    });
    await exec();

    if (!data || isError.value) {
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

    const { data, count, isError, exec } = useAxios<SuperHero>({
      url: resourceUrl,
      method: 'get',
      config: httpConfig,
    });
    await exec();

    if (!data || isError.value) {
      commit('setSuperHeroes', []);
      return;
    }

    commit('setSuperHeroes', data.value);
    return count?.value;
  },

  async updateSuperHero({ commit }, payload: SuperHero) {
    const { data, exec, isError } = useAxios<SuperHero>({
      url: `${resourceUrl}/${payload.id}`,
      method: 'put',
      data: payload,
    });
    await exec();
    if (isError.value) {
      return { ok: false };
    }

    commit('updateSuperHero', { ...(data && data.value) });
    return { ok: true };
  },

  async createSuperHero({ commit }, payload: SuperHero) {
    const { exec, isError } = useAxios<SuperHero>({
      url: resourceUrl,
      method: 'post',
      data: payload,
    });
    await exec();
    if (isError.value) {
      return { ok: false };
    }
    commit('addSuperHero', payload);
    return { ok: true };
  },

  async deleteSuperHero({ commit }, payload: string): Promise<HttpStatus> {
    const { exec, isError } = useAxios<SuperHero>({
      url: `${resourceUrl}/${payload}`,
      method: 'delete',
    });
    await exec();
    if (isError.value) {
      return { ok: false };
    }
    commit('deleteSuperHero', payload);
    return { ok: true };
  },
};

export default actions;