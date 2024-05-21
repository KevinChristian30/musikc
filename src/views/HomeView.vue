<template>
  <app-introduction></app-introduction>

  <app-main-content></app-main-content>
</template>

<script>
import AppIntroduction from '@/components/AppIntroduction.vue';
import AppMainContent from '@/components/AppMainContent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    AppIntroduction,
    AppMainContent
  }
});
</script>
