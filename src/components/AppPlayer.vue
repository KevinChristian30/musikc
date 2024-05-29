<template>
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <div class="text-center">
      <span class="song-title font-bold">{{ currentSong.modified_name }}</span> by
      <span class="song-artist">{{ currentSong.display_name }}</span>
    </div>

    <div class="flex flex-nowrap gap-4 items-center">
      <button type="button" @click.prevent="toggleAudio">
        <i
          class="fa text-gray-500 text-xl"
          :class="{ 'fa-play': !playing, 'fa-pause': playing }"
        ></i>
      </button>

      <div class="player-currenttime">{{ seek }}</div>

      <div
        @click.prevent="updateSeek"
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
      >
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle"></i>
        </span>

        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        ></span>
      </div>

      <div class="player-duration">{{ duration }}</div>
    </div>
  </div>
</template>

<script>
import usePlayerStore from '@/stores/player';
import { mapActions, mapState } from 'pinia';

export default {
  name: 'AppPlayer',
  methods: {
    ...mapActions(usePlayerStore, ['toggleAudio', 'updateSeek'])
  },
  computed: {
    ...mapState(usePlayerStore, ['currentSong', 'playing', 'duration', 'seek', 'playerProgress'])
  }
};
</script>
