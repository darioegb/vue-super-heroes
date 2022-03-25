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
      const response = ['post', 'put', 'patch'].includes(method)
        ? await axios[method](fullUrl, data, config)
        : await axios[method](fullUrl, config);
      state.data = response.data as UnwrapRef<T>;
      // x-total-change if parameter for json server can be changed
      state.count = response.headers
        ? +(response.headers as Record<string, string>)['x-total-count']
        : undefined;
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

export default useAxios;
