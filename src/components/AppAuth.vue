<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal" :class="hiddenClass">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="py-4 text-left px-6">
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <div class="modal-close cursor-pointer z-50" @click="modalVisibility = false">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="[
                  isLogin ? 'hover:text-white text-white bg-blue-600' : 'hover:text-blue-600'
                ]"
                href="#"
                @click.prevent="isLogin = true"
                >Login</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="[
                  !isLogin ? 'hover:text-white text-white bg-blue-600' : 'hover:text-blue-600'
                ]"
                href="#"
                @click.prevent="isLogin = false"
                >Register</a
              >
            </li>
          </ul>

          <login-form v-if="isLogin"></login-form>

          <register-form v-else></register-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapWritableState } from 'pinia';
import useModalStore from '@/stores/modal';
import RegisterForm from './forms/RegisterForm.vue';
import LoginForm from './forms/LoginForm.vue';

export default {
  name: 'AppAuth',
  data() {
    return {
      isLogin: Boolean,
      registerSchema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:10|max_value:130',
        password: 'required|min:8|max:100',
        confirm_password: 'confirmed:@password',
        country: 'required',
        tos: 'required'
      },
      loginSchema: {
        email: 'required|min:3|max:100|email',
        password: 'required'
      },
      initialFormValues: {
        country: 'Indonesia'
      },
      reg_loading: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Your account is being created'
    };
  },
  computed: {
    ...mapState(useModalStore, ['hiddenClass']),
    ...mapWritableState(useModalStore, {
      modalVisibility: 'isOpen'
    })
  },
  components: {
    RegisterForm,
    LoginForm
  }
};
</script>
