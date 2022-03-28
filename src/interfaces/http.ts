import { Ref } from 'vue';

import { HttpMethod, Order } from 'src/types';

export interface RequestState<T> {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  data?: T;
  count?: number;
}

export interface ServerPaginationConfig {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: Order;
  name_like?: string;
}

export interface HttpConfig {
  headers?: Record<string, string | number | boolean>;
  params?: ServerPaginationConfig;
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
