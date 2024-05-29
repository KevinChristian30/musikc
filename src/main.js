import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VeeValidatePlugin from './plugins/validation';
import Icon from './directives/icon';
import { auth } from './plugins/firebase';
import './assets/base.css';
import i18n from './plugins/i18n';

let app;

auth.onAuthStateChanged(() => {
  if (!app) app = createApp(App);

  app.use(createPinia());
  app.use(router);
  app.use(VeeValidatePlugin);
  app.use(i18n);

  app.directive('icon', Icon);

  app.mount('#app');
});
