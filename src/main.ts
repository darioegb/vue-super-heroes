import { createApp } from 'vue';
import { Quasar } from 'quasar';

import '@/styles/styles.scss';
import './config/firebase';
import App from './App.vue';
import router from './router';
import store from './store';
import quasarUserOptions from './config/quasar-user-options';
import i18n from './config/i18n';
import { uppercase } from './directives';

createApp(App)
  .use(i18n)
  .use(Quasar, quasarUserOptions)
  .use(store)
  .use(router)
  .directive(uppercase.name, uppercase.function)
  .mount('#app');
