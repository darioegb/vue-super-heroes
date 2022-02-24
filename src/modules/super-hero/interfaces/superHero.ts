import { GenreEnum } from '@/constant';
import { Option } from '@/interfaces';
import { GenericOrUndefined } from '@/types';

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
