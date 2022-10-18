import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/dist/quasar.css';
import en from '../src/assets/i18n/en.json';

import { app } from '@storybook/vue3';
import { createI18n } from 'vue-i18n';
import { Dialog, Notify, Quasar } from 'quasar';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en },
});

app.use(i18n);
app.use(Quasar, {
  config: {
    dark: 'auto',
    notify: {
      position: 'top-right',
      type: 'positive',
    },
  },
  plugins: [Dialog, Notify],
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
