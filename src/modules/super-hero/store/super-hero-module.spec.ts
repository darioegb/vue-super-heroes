import { describe, expect, it, jest } from '@jest/globals';
import { defaultPageConfig } from 'src/globals';
import { SuperHeroState } from 'src/modules/super-hero/interfaces';

const mockFn = jest.fn();

import createVuexStore from 'src/testing/mock-store';
import { superHeroesState } from 'src/testing/test-super-hero-state';

jest.mock('axios', () => ({
  get: mockFn,
  post: mockFn,
  put: mockFn,
  delete: mockFn,
}));

describe('super-hero-module', () => {
  const initialState: SuperHeroState = {
    superHeroes: [],
    selectedSuperHero: undefined,
  };
  const pageConfig = { ...defaultPageConfig };
  const updatedSuperHero = {
    ...superHeroesState.superHeroes[0],
    specialty: 'esto es una prueba nueva',
  };
  const newSuperHero = {
    id: '3',
    name: 'SUPER MAN',
    genre: 1,
    specialty: 'esto es una prueba 1',
  };

  it('should return initial state', () => {
    const store = createVuexStore(initialState);
    const { superHeroes, selectedSuperHero } = store.state.superHeroes;
    expect(superHeroes).toEqual([]);
    expect(selectedSuperHero).toBeUndefined();
  });

  it('should set selected super hero', () => {
    const store = createVuexStore();
    const selectedSuperHero = superHeroesState.superHeroes[0];
    store.commit('superHeroes/setSelectedSuperHero', selectedSuperHero);
    expect(store.state.superHeroes.selectedSuperHero).toEqual(
      selectedSuperHero,
    );
  });

  it('should set setSuperHeroes with getSuperHeroesPage action', async () => {
    mockFn.mockReturnValueOnce({
      data: superHeroesState.superHeroes,
      headers: {
        'x-total-count': 2,
      },
    } as never);
    const store = createVuexStore(initialState);
    const count = (await store.dispatch('superHeroes/getSuperHeroesPage', {
      pagination: pageConfig,
      filter: 'man',
    })) as number;
    expect(store.state.superHeroes.superHeroes.length).toBe(2);
    expect(count).toBe(2);
  });

  it('should set setSuperHeroes with getSuperHeroesPage action without data when error occurred', async () => {
    mockFn.mockRejectedValueOnce(new Error('Async Error'));
    const store = createVuexStore(initialState);
    await store.dispatch('superHeroes/getSuperHeroesPage', {
      pagination: pageConfig,
    });
    expect(store.state.superHeroes.superHeroes.length).toBe(0);
  });

  it('should updateSuperHero with updateSuperHero action', async () => {
    mockFn.mockReturnValueOnce({
      data: updatedSuperHero,
    } as never);
    const store = createVuexStore();
    const isError = (await store.dispatch(
      'superHeroes/updateSuperHero',
      updatedSuperHero,
    )) as boolean;
    expect(isError).toBeFalsy();
    expect(store.state.superHeroes.superHeroes[0]).toEqual(updatedSuperHero);
  });

  it("should'n updateSuperHero with updateSuperHero action when error occurred", async () => {
    mockFn.mockRejectedValueOnce(new Error('Async Error'));
    const store = createVuexStore();
    const isError = (await store.dispatch(
      'superHeroes/updateSuperHero',
      updatedSuperHero,
    )) as boolean;
    expect(isError).toBeTruthy();
    expect(store.state.superHeroes.superHeroes[0]).not.toEqual(
      updatedSuperHero,
    );
  });

  it('should deleteSuperHero with deleteSuperHero action', async () => {
    mockFn.mockReturnValueOnce({});
    const store = createVuexStore();
    const deletedSuperHero = store.state.superHeroes.superHeroes[0];
    const isError = (await store.dispatch(
      'superHeroes/deleteSuperHero',
      deletedSuperHero.id,
    )) as boolean;
    expect(isError).toBeFalsy();
    expect(store.state.superHeroes.superHeroes.length).toBe(1);
    expect(store.state.superHeroes.superHeroes[0]).not.toEqual(
      deletedSuperHero,
    );
  });

  it("should'n deleteSuperHero with deleteSuperHero action when error occurred", async () => {
    mockFn.mockRejectedValueOnce(new Error('Async Error'));
    const store = createVuexStore();
    const deletedSuperHero = store.state.superHeroes.superHeroes[0];
    const isError = (await store.dispatch(
      'superHeroes/deleteSuperHero',
      deletedSuperHero.id,
    )) as boolean;
    expect(isError).toBeTruthy();
    expect(store.state.superHeroes.superHeroes.length).toBe(2);
    expect(store.state.superHeroes.superHeroes[0]).toEqual(deletedSuperHero);
  });

  it('should addSuperHero with createSuperHero action', async () => {
    mockFn.mockReturnValueOnce({ data: newSuperHero });
    const store = createVuexStore();
    const isError = (await store.dispatch(
      'superHeroes/createSuperHero',
      newSuperHero,
    )) as boolean;
    expect(isError).toBeFalsy();
    expect(store.state.superHeroes.superHeroes[2]).toEqual(newSuperHero);
  });

  it("should'n addSuperHero with createSuperHero action when error occurred", async () => {
    mockFn.mockRejectedValueOnce(new Error('Async Error'));
    const store = createVuexStore();
    const isError = (await store.dispatch(
      'superHeroes/createSuperHero',
      newSuperHero,
    )) as boolean;
    expect(isError).toBeTruthy();
    expect(store.state.superHeroes.superHeroes[2]).not.toEqual(newSuperHero);
  });
});
