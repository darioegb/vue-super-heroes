import { createI18n } from 'vue-i18n';

import en from '@/assets/i18n/en.json';
import es from '@/assets/i18n/es.json';

const messages = { en, es };

// 2. Create i18n instance with options
const i18n = createI18n({
  legacy: false,
  locale: 'es', // set locale
  fallbackLocale: ['es', 'en'], // set fallback locale
  messages, // set locale messages,
  missingWarn: false, // fallback warn not found key...
  fallbackWarn: false, // fallback warn  fall back to...
});

export default i18n;
