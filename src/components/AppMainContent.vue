<template>
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon="'headphones-alt'">
        <span class="card-title">Songs</span>
      </div>

      <ol id="playlist">
        <app-song-item v-for="song in songs" :key="song.id" :song="song"></app-song-item>
      </ol>
    </div>
  </section>
</template>

<script>
import AppSongItem from './AppSongItem.vue';

export default {
  name: 'AppMainContent',
  props: {
    songs: []
  },
  components: {
    AppSongItem
  }
};
</script>
