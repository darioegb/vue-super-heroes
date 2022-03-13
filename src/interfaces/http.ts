import { Ref } from 'vue';

import { HttpMethod } from 'src/types';

export interface RequestState<T> {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  data?: T;
  count?: number;
}

export interface HttpConfig {
  headers?: Record<string, string | number | boolean>;
  params?: Record<string, unknown>;
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
