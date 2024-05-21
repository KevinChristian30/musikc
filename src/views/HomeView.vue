<template>
  <app-introduction></app-introduction>

  <app-main-content :songs="songs"></app-main-content>
</template>

<script>
import AppIntroduction from '@/components/AppIntroduction.vue';
import AppMainContent from '@/components/AppMainContent.vue';
import { songsCollection } from '@/plugins/firebase';

export default {
  name: 'HomeView',
  components: {
    AppIntroduction,
    AppMainContent
  },
  data() {
    return {
      songs: []
    };
  },
  async created() {
    const snapshots = await songsCollection.get();
    snapshots.forEach((document) => {
      this.songs.push({
        id: document.id,
        ...document.data()
      });
    });
  }
};
</script>
