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

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppIntroduction,
    AppMainContent,
    AppPlayer
  }
};
</script>
