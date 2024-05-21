<template>
  <app-header></app-header>

  <app-introduction></app-introduction>

  <app-main-content></app-main-content>

  <app-player></app-player>

  <app-auth></app-auth>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import AppAuth from '@/components/AppAuth.vue';
import AppIntroduction from '@/components/AppIntroduction.vue';
import AppMainContent from '@/components/AppMainContent.vue';
import AppPlayer from '@/components/AppPlayer.vue';
import useUserStore from '@/stores/user';
import { mapWritableState } from 'pinia';
import { auth } from './plugins/firebase';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppIntroduction,
    AppMainContent,
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
