import { Notify } from 'quasar';
import { httpMethodKeys } from 'src/globals';
import { reactive, toRefs, UnwrapRef } from 'vue';
import axios from 'axios';

import {
  RequestState,
  AxiosConfig,
  AxiosResponse,
  AxiosExecConfig,
} from 'src/interfaces';
import i18n from 'src/config/i18n';

export const useAxios = <T>({
  url,
  method,
  data,
  config,
  apiBaseUrl,
}: AxiosConfig<T>): AxiosResponse<T> => {
  const { t: translate } = i18n.global;

  if (!apiBaseUrl) {
    apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
  }
  const fullUrl = `${apiBaseUrl as string}/${url}`;
  const initialState = () => ({
    isError: false,
    data: undefined,
    count: undefined,
  });
  const state = reactive<RequestState<T>>(initialState());
  if (!config?.headers) {
    config = { ...config, headers: { 'Content-type': 'application/json' } };
  }

  const exec = async (execConf: AxiosExecConfig) => {
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
      execConf?.showErrorMessage && handleError(execConf?.resource);
      state.isError = true;
    }
  };

  const handleError = (resource = 'default') => {
    navigator.onLine
      ? Notify.create({
          message: translate(
            `globals.toasts.${httpMethodKeys[method as never] as string}.error`,
            {
              value: translate(`${resource}.detail.title`),
            },
          ),
          type: 'negative',
        })
      : Notify.create({
          message: translate('globals.toasts.bgAsync'),
          type: 'warning',
        });
  };

  return {
    ...toRefs(state),
    exec,
  } as AxiosResponse<T>;
};

export default useAxios;
