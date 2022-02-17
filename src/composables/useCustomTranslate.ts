import { ObjectNumberIndexer } from '@/interfaces';
import { useI18n } from 'vue-i18n';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCustomTranslate = () => {
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
