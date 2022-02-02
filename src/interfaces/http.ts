import { ObjectIndexer } from './';

export interface RequestState<T> {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  data?: T;
  count?: number;
}

export interface HttpConfig {
  headers?: ObjectIndexer<unknown>;
  params?: ObjectIndexer<unknown>;
}
