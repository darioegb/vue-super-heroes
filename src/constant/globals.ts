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
export const rowsPerPageConfig = [5, 10, 15, 20, 0];
export const defaultPageConfig: PageConfig<unknown> = {
  page: 0,
  rowsPerPage: 5,
  rowsNumber: 100,
  sortBy: 'id',
  descending: false,
};
export const regExp = {
  alphabet: /^[A-Za-z ]*$/,
};
export const pictureBasePath = 'pictures';
