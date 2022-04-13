import i18next from 'i18next';

import en from '@Static/static/locales/en/common.json';
import zhHans from '@Static/static/locales/zh_Hans/common.json';

i18next.init({
  lng: 'zhHans',
  ns: ['common'],
  defaultNS: 'common',
  resources: {
    en: {
      common: en,
    },
    zhHans: {
      common: zhHans,
    },
  },
});

export function useTranslation(namespace = 'common') {
  const t = (key: string, data: any = {}) => i18next.t(key, data, { ns: namespace });
  return { t };
}

export const getTranslation = useTranslation;
