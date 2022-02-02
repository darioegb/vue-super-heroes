import axios from 'axios';
import { Loading } from 'quasar';

export const useAxiosLoader = (): void => {
  axios.interceptors.request.use(
    (config: unknown) => {
      Loading.show();
      return config;
    },
    (error: unknown) => {
      Loading.hide();
      return Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    (response: unknown) => {
      Loading.hide();
      return response;
    },
    (error: unknown) => {
      Loading.hide();
      return Promise.reject(error);
    },
  );
};
