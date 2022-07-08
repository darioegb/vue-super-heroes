import { SuperHeroState } from 'src/modules/super-hero/interfaces';

export const superHeroesState: SuperHeroState = {
  superHeroes: [
    {
      id: '1',
      name: 'BATMAN',
      genre: 1,
      specialty: 'esto es una prueba 1',
    },
    {
      id: '2',
      name: 'IRON MAN',
      genre: 1,
      specialty: 'esto es una prueba 1',
    },
  ],
  selectedSuperHero: undefined,
};
