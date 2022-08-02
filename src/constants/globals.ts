import { PageConfig } from 'src/interfaces';

export const assetRoot = 'src/assets';
export const imgSrc = `${assetRoot}/img`;
export const idKey = 'id';
export const httpMethodKeys = {
  get: 'get',
  delete: 'remove',
  post: 'create',
  put: 'update',
};
export const rowsPerPageConfig = [5, 10, 15, 20, 30, 50, 100, 0];
export const defaultPageConfig: PageConfig<unknown> = {
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 100,
  sortBy: 'id',
  descending: false,
};
export const regExp = {
  alphabet: /^[A-Za-z ]*$/,
};
export const pictureBasePath = 'pictures';
export const defaultFormControlSizes = {
  text: {
    min: 3,
    max: 60,
  },
  email: {
    min: 10,
    max: 100,
  },
  number: {
    min: 1,
    max: 999_999_999,
  },
  textarea: {
    min: 10,
    max: 250,
  },
};
