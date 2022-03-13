import { ComputedRef } from 'vue';

import { GenreEnum } from 'src/constant';
import { HttpStatus, Option, RequestGrid } from 'src/interfaces';
import { GenericOrUndefined } from 'src/types';

interface SuperHeroCommons {
  name: string;
  specialty: string;
  age?: number;
  height?: number;
  weight?: number;
}
export interface SuperHero extends SuperHeroCommons {
  id?: string;
  picture?: string;
  genre: GenreEnum;
}

export interface SuperHeroForm extends SuperHeroCommons {
  genre?: Option;
  picture?: File;
}

export interface SuperHeroState {
  superHeroes: SuperHero[];
  selectedSuperHero?: GenericOrUndefined<SuperHero>;
}

export interface SuperHeroResponse {
  superHeroes: ComputedRef<SuperHero[]>;
  selectedSuperHero: ComputedRef<GenericOrUndefined<SuperHero>>;
  superHeroCount: ComputedRef<number>;
  setSelectedSuperHero: (superHero: SuperHero) => void;
  getSuperHeroes: () => Promise<void>;
  getSuperHeroesPage: (
    requestGrid: RequestGrid<SuperHero>
  ) => Promise<number | undefined>;
  updateSuperHero: (superHero: SuperHero) => Promise<HttpStatus>;
  createSuperHero: (superHero: SuperHero) => Promise<HttpStatus>;
  deleteSuperHero: (id: string) => Promise<HttpStatus>;
}
