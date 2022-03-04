import { Ref } from 'vue';

import { HttpMethod } from '@/types';
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

export interface AxiosConfig<T> {
  url: string;
  method: HttpMethod;
  data?: T;
  config?: HttpConfig;
  apiBaseUrl?: string;
}

export interface AxiosResponse<T> {
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  errorMessage: Ref<string>;
  data?: Ref<T>;
  count?: Ref<number>;
  exec: () => Promise<void>;
}
