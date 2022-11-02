import { PageConfig } from 'src/interfaces';

export const ID_KEY = 'id';
export const HTTP_METHOD_KEYS: Record<string, string> = {
  get: 'get',
  delete: 'remove',
  post: 'create',
  put: 'update',
};
export const ROWS_PER_PAGE_CONFIG = [5, 10, 15, 20, 30, 50, 100, 0];
export const DEFAULT_PAGE_CONFIG: PageConfig<unknown> = {
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 100,
  sortBy: 'id',
  descending: false,
};
export const PICTURE_BASE_PATH = 'pictures';
export const DEFAULT_FORM_CONTROL_SIZES: Record<
  string,
  Record<string, number>
> = {
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
