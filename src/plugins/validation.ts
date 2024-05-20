import { Field as VeeField, Form as VeeForm, defineRule, ErrorMessage } from 'vee-validate';
import type { App } from 'vue';
import { required } from '@vee-validate/rules';

export default {
  install(app: App) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
  }
};
