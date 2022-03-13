import { reactive, toRefs, UnwrapRef } from 'vue';
import axios from 'axios';

import { RequestState, AxiosConfig, AxiosResponse } from 'src/interfaces';

export const useAxios = <T>({
  url,
  method,
  data,
  config,
  apiBaseUrl,
}: AxiosConfig<T>): AxiosResponse<T> => {
  if (!apiBaseUrl) {
    apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
  }
  const fullUrl = `${apiBaseUrl as string}/${url}`;
  const initialState = () => ({
    isLoading: true,
    isError: false,
    errorMessage: '',
    data: undefined,
    count: undefined,
  });
  const state = reactive<RequestState<T>>(initialState());
  if (!config?.headers) {
    config = { ...config, headers: { 'Content-type': 'application/json' } };
  }

  const exec = async () => {
    Object.assign(state, initialState());
    try {
      const response = await axios({
        method,
        url: fullUrl,
        headers: config?.headers,
        params: config?.params,
        data,
      });
      state.data = response.data as UnwrapRef<T>;
      // x-total-change if parameter for json server can be changed
      state.count = +(response.headers as { 'x-total-count': string })[
        'x-total-count'
      ];
    } catch (error: unknown) {
      state.isError = true;
      state.errorMessage = (error as { message: string }).message;
    } finally {
      state.isLoading = false;
    }
  };

  return {
    ...toRefs(state),
    exec,
  } as AxiosResponse<T>;
};
