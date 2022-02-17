import { ObjectIndexer } from './';

export interface RequestState<T> {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  data?: T;
  count?: number;
}

export interface HttpConfig {
  headers?: ObjectIndexer<string | number | boolean>;
  params?: ObjectIndexer<unknown>;
}

export interface HttpStatus {
  ok: boolean;
}
