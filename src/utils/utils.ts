import { ref, StorageReference } from 'firebase/storage';

import { firebaseStorage } from 'src/config/firebase';
import { PICTURE_BASE_PATH } from 'src/globals';
import { Option, RequestGrid, ServerPaginationConfig } from 'src/interfaces';

/**
 * Get enum keys from enum object
 * @param type enum
 */
export const getEnumKeys = <T extends Record<string, unknown>>(
  type: T,
): string[] => Object.keys(type).filter((key) => !Number(key));

/**
 * Convert enum Object to array from key, value par.
 * @param type enum
 * @example [ { key: 'A', value: 1 }, { key: 'B', value: 2 } ]
 */
export const convertEnumToKeyValueArray = <T extends Record<string, unknown>>(
  type: T,
): Option[] =>
  getEnumKeys(type).map((key) => ({ key, value: type[key] } as Option));

/**
 * Convert file to base64 string.
 * @param file File
 * @returns Promise<unknown>
 */
export const fileToBase64String = (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.readAsDataURL(file);
    reader.onload = (): void => resolve(reader.result as string);
  });
};

export const fileRef = (fileName: string): StorageReference =>
  ref(firebaseStorage, `${PICTURE_BASE_PATH}/${fileName}`);

export const fileName = (): string => `picture-${Date.now()}`;

export const createHttpParams = <T>(
  requestGrid: RequestGrid<T>,
): ServerPaginationConfig => {
  let params: ServerPaginationConfig = {};
  const {
    pagination: { descending, page, rowsPerPage, sortBy },
    filter,
  } = requestGrid;
  params = {
    _page: page,
    ...(rowsPerPage > 0 && { _limit: rowsPerPage }),
    _sort: sortBy as string,
    _order: descending ? 'desc' : 'asc',
  };

  if (filter && filter.length > 0) {
    params.name_like = filter;
  }

  return params;
};
