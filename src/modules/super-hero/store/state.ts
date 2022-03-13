import { SuperHeroState } from 'src/modules/super-hero/interfaces';

function state(): SuperHeroState {
  return {
    superHeroes: [],
    selectedSuperHero: undefined,
  };
}

export default state;
