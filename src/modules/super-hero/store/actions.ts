import { ActionTree } from 'vuex';

import { State } from 'src/store';
import { SuperHero, SuperHeroState } from 'src/modules/super-hero/interfaces';
import { useAxios } from 'src/composables';
import { HttpConfig, HttpStatus, RequestGrid } from 'src/interfaces';

const resourceUrl = 'superHeroes';

const actions: ActionTree<SuperHeroState, State> = {
  async getSuperHeroesPage({ commit }, payload: RequestGrid<SuperHero>) {
    const httpConfig: HttpConfig = { params: {} };
    const {
      pagination: { descending, page, rowsPerPage, sortBy },
      filter,
    } = payload;
    httpConfig.params = {
      _page: page,
      ...(rowsPerPage > 0 && { _limit: rowsPerPage }),
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

    commit('setSuperHeroes', !data || isError.value ? [] : data.value);
    return count?.value;
  },

  async updateSuperHero({ commit }, payload: SuperHero) {
    const { data, exec, isError } = useAxios<SuperHero>({
      url: `${resourceUrl}/${payload.id as string}`,
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
