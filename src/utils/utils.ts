import { Option } from '@/interfaces';

/**
 * Get enum keys from enum object
 * @param type enum
 */
export const getEnumKeys = <T>(type: T): string[] =>
  Object.keys(type).filter((key) => !Number(key));

/**
 * Convert enum Object to array from key, value par.
 * @param type enum
 * @example [ { key: 'A', value: 1 }, { key: 'B', value: 2 } ]
 */
export const convertEnumToKeyValueArray = <T extends unknown>(
  type: T,
): Option[] =>
  getEnumKeys(type).map(
    (key) =>
      ({ key, value: type[key as keyof typeof type] as unknown } as Option),
  );
