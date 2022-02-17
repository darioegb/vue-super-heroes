import { reactive, toRefs } from 'vue';
import axios from 'axios';

import { HttpMethod } from '@/types';
import { HttpConfig, RequestState } from '@/interfaces';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAxios = <T>(
  url: string,
  method: HttpMethod,
  data?: T,
  config?: HttpConfig,
  apiBaseUrl = process.env.VUE_APP_API_BASE_URL,
) => {
  const fullUrl = `${apiBaseUrl}/${url}`;
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
      state.data = response.data;
      state.count = +response.headers['x-total-count'];
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
  };
};
