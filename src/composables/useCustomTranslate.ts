import { useI18n } from 'vue-i18n';

import { CustomTranslateResponse, ObjectNumberIndexer } from '@/interfaces';

export const useCustomTranslate = (): CustomTranslateResponse => {
  const { t: translate } = useI18n({ inheritLocale: true });
  const dropdownTranslate = <T extends ObjectNumberIndexer>(
    path: string,
    value: number,
    object: T,
  ): string => translate(`${path}.${object[value]?.toLowerCase()}`);
  return {
    dropdownTranslate,
  };
};
