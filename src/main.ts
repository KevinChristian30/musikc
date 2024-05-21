import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VeeValidatePlugin from './plugins/validation';
import { auth } from './plugins/firebase';

import './assets/base.css';
import './assets/main.css';

let app: App | undefined;

auth.onAuthStateChanged(() => {
  if (!app) app = createApp(App);

  app.use(createPinia());
  app.use(router);
  app.use(VeeValidatePlugin);

  app.mount('#app');
});
