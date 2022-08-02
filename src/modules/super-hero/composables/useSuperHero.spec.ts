import { describe, expect, it, jest } from '@jest/globals';
import { defaultPageConfig } from 'src/constants';
import { SuperHeroState } from 'src/modules/super-hero/interfaces';

// must define this above the `useSuperHero` import, otherwise the ReferenceError is raised.
const mockFn = jest.fn();
const mockUseStoreFn = jest.fn(() => undefined);

import { superHeroesState } from 'src/testing/test-super-hero-state';
import { useSuperHero } from './';

jest.mock('vuex', () => ({
  useStore: mockUseStoreFn,
}));

describe('useSuperHero', () => {
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

  const setState = (superHeroState?: SuperHeroState) => {
    mockUseStoreFn.mockReturnValueOnce({
      state: {
        superHeroes: superHeroState
          ? superHeroState
          : {
              superHeroes: [],
              selectedSuperHero: undefined,
            },
      },
      commit: mockFn,
      dispatch: mockFn,
    } as never);
  };

  it('should return initial state', () => {
    setState();
    const { superHeroes, selectedSuperHero } = useSuperHero();
    expect(superHeroes.value).toEqual([]);
    expect(selectedSuperHero.value).toBeUndefined();
  });

  it('should set selected super hero', () => {
    setState(superHeroesState);
    const { setSelectedSuperHero } = useSuperHero();

    const superHero = superHeroesState.superHeroes[0];
    setSelectedSuperHero(superHero);
    expect(mockFn).toHaveBeenCalledWith(
      'superHeroes/setSelectedSuperHero',
      superHero,
    );
  });

  it('should set setSuperHeroes with getSuperHeroesPage action', async () => {
    const requestGrid = {
      pagination: pageConfig,
      filter: 'man',
    };
    setState();
    const { getSuperHeroesPage } = useSuperHero();

    await getSuperHeroesPage(requestGrid);
    expect(mockFn).toHaveBeenCalledWith(
      'superHeroes/getSuperHeroesPage',
      requestGrid,
    );
  });

  it('should updateSuperHero with updateSuperHero action', async () => {
    setState(superHeroesState);
    const { updateSuperHero } = useSuperHero();
    await updateSuperHero(updatedSuperHero);
    expect(mockFn).toHaveBeenCalledWith(
      'superHeroes/updateSuperHero',
      updatedSuperHero,
    );
  });

  it('should deleteSuperHero with deleteSuperHero action', async () => {
    setState(superHeroesState);
    const { superHeroes, deleteSuperHero } = useSuperHero();
    const deletedSuperHero = superHeroes.value[0];
    const id = deletedSuperHero.id;
    id && (await deleteSuperHero(id));
    expect(mockFn).toHaveBeenCalledWith('superHeroes/deleteSuperHero', id);
  });

  it('should addSuperHero with createSuperHero action', async () => {
    setState(superHeroesState);
    const { createSuperHero } = useSuperHero();
    await createSuperHero(newSuperHero);
    expect(mockFn).toHaveBeenCalledWith(
      'superHeroes/createSuperHero',
      newSuperHero,
    );
  });
});
