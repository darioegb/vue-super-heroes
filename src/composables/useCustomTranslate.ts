import { CustomTranslateResponse } from 'src/interfaces';
import { useI18n } from 'vue-i18n';

export const useCustomTranslate = (): CustomTranslateResponse => {
  const { t: translate } = useI18n({ useScope: 'global' });

  const dropdownTranslate = <T extends Record<number, string>>(
    path: string,
    value: number,
    object: T
  ): string => translate(`${path}.${object[value].toLowerCase()}`);
  return {
    dropdownTranslate,
  };
};

export default useCustomTranslate;
