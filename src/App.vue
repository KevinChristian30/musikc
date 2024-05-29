<template>
  <app-header></app-header>

  <router-view></router-view>

  <app-player></app-player>
  <app-auth></app-auth>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import AppAuth from '@/components/AppAuth.vue';
import AppPlayer from '@/components/AppPlayer.vue';
import useUserStore from '@/stores/user';
import { mapWritableState } from 'pinia';
import { auth } from './plugins/firebase';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppPlayer
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  }
};
</script>
