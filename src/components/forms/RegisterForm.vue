<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="reg_show_alert"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
  </div>

  <vee-form
    :validation-schema="registerSchema"
    @submit="register"
    :initial-values="initialFormValues"
  >
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <error-message class="text-red-500" name="name" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="email"
        placeholder="Enter Email"
      />
      <error-message class="text-red-500" name="email" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="age"
      />
      <error-message class="text-red-500" name="age" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">{{ error }}</div>
      </vee-field>
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
        name="confirm_password"
      />
      <error-message class="text-red-500" name="confirm_password" />
    </div>

    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="country"
      >
        <option value="Indonesia">Indonesia</option>
        <option value="Outside Indonesia">Outside Indonesia</option>
      </vee-field>
      <error-message class="text-red-500" name="country" />
    </div>

    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        name="tos"
        value="1"
      />
      <label for="tos" class="inline-block">Accept terms of service</label>
      <br />
      <error-message class="text-red-500" name="tos" />
    </div>

    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_loading"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import useUserStore from '@/stores/user';
import { mapActions } from 'pinia';

export default {
  name: 'RegisterForm',
  data() {
    return {
      registerSchema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:10|max_value:130',
        password: 'required|min:8|max:100',
        confirm_password: 'confirmed:@password',
        country: 'required',
        tos: 'required'
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
  methods: {
    ...mapActions(useUserStore, { createUser: 'register' }),
    async register(values) {
      this.reg_show_alert = true;
      this.reg_loading = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_msg = 'Your account is being created';

      try {
        await this.createUser(values);
      } catch (error) {
        this.reg_loading = false;
        this.reg_alert_variant = 'bg-red-500';
        this.reg_alert_msg = 'An error occured, please try again later';
        return;
      }

      this.reg_alert_variant = 'bg-green-500';
      this.reg_alert_msg = 'Success, your account has been created';

      window.location.reload();
    }
  }
};
</script>
