import { ActionTree } from 'vuex';

import { State } from 'src/store';
import { SuperHero, SuperHeroState } from 'src/modules/super-hero/interfaces';
import { useAxios } from 'src/composables';
import { HttpConfig, RequestGrid } from 'src/interfaces';
import { createHttpParams } from 'src/utils';

const resourceUrl = 'superHeroes';

const actions: ActionTree<SuperHeroState, State> = {
  async getSuperHeroesPage({ commit }, payload: RequestGrid<SuperHero>) {
    const httpConfig: HttpConfig = {
      params: createHttpParams<SuperHero>(payload),
    };
    const { data, count, isError, exec } = useAxios<SuperHero[]>({
      url: resourceUrl,
      method: 'get',
      config: httpConfig,
    });
    await exec();

    commit('setSuperHeroes', !data || isError.value ? [] : data.value);
    return count?.value;
  },

  async updateSuperHero({ commit }, payload: SuperHero): Promise<boolean> {
    const { data, exec, isError } = useAxios<SuperHero>({
      url: `${resourceUrl}/${payload.id as string}`,
      method: 'put',
      data: payload,
    });
    await exec();
    if (isError.value) return isError.value;

    commit('updateSuperHero', { ...(data && data.value) });
    return isError.value;
  },

  async createSuperHero({ commit }, payload: SuperHero): Promise<boolean> {
    const { exec, isError } = useAxios<SuperHero>({
      url: resourceUrl,
      method: 'post',
      data: payload,
    });
    await exec();
    if (isError.value) return isError.value;

    commit('addSuperHero', payload);
    return isError.value;
  },

  async deleteSuperHero({ commit }, payload: string): Promise<boolean> {
    const { exec, isError } = useAxios<SuperHero>({
      url: `${resourceUrl}/${payload}`,
      method: 'delete',
    });
    await exec();
    if (isError.value) return isError.value;

    commit('deleteSuperHero', payload);
    return isError.value;
  },
};

export default actions;
