import { createApp } from 'vue';
import { Quasar } from 'quasar';

import App from './App.vue';
import router from './router';
import store from './store';
import quasarUserOptions from './config/quasar-user-options';
import i18n from './config/i18n';

createApp(App)
  .use(i18n)
  .use(Quasar, quasarUserOptions)
  .use(store)
  .use(router)
  .mount('#app');
