import { ObjectNumberIndexer } from '.';

export interface CustomTranslateResponse {
  dropdownTranslate: <T extends ObjectNumberIndexer>(
    path: string,
    value: number,
    object: T,
  ) => string;
}
