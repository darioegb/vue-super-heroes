import lang from 'quasar/lang/es.js';
import '@quasar/extras/material-icons/material-icons.css';
import { Dialog, Notify } from 'quasar';

// To be used on app.use(Quasar, { ... })

export default {
  config: {
    notify: {
      position: 'top-right',
      type: 'positive',
    },
  },
  plugins: {
    Dialog,
    Notify,
  },
  lang: lang,
};
