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
      songs: [],
      maxPerPage: 25,
      requesting: false
    };
  },
  methods: {
    async getSongs() {
      if (this.requesting) {
        return;
      }

      this.requesting = true;

      let snapshots;
      if (this.songs.length) {
        const lastDocument = await songsCollection.doc(this.songs[this.songs.length - 1].id).get();
        snapshots = await songsCollection
          .orderBy('modified_name')
          .startAfter(lastDocument)
          .limit(this.maxPerPage)
          .get();
      } else {
        snapshots = await songsCollection.orderBy('modified_name').limit(this.maxPerPage).get();
      }

      snapshots.forEach((document) => {
        this.songs.push({
          id: document.id,
          ...document.data()
        });
      });

      this.requesting = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const innerHeight = window.innerHeight;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    }
  },
  async created() {
    window.addEventListener('scroll', this.handleScroll);
    await this.getSongs();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>
