import { defineStore } from 'pinia';
import { Howl } from 'howler';
import formatTime from '@/utils/helpers';

export default defineStore('player', {
  state: () => ({
    currentSong: {},
    sound: null as Howl | null,
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  }),
  actions: {
    async newSong(song: any) {
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.currentSong = song;
      this.sound = new Howl({
        src: [song.url],
        html5: true
      });

      this.sound.play();

      this.sound.on('play', () => {
        requestAnimationFrame(this.progress);
      });
    },
    async toggleAudio() {
      if (!this.sound || !this.sound.playing) {
        return;
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
    progress() {
      if (!this.sound) {
        return;
      }

      this.seek = formatTime(this.sound.seek());
      this.duration = formatTime(this.sound.duration());

      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`;

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
    updateSeek(event: any) {
      if (!this.sound || !this.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once('seek', this.progress);
    }
  },
  getters: {
    playing: (state) => {
      if (!state.sound) {
        return;
      }

      if (state.sound.playing()) {
        return state.sound.playing();
      }

      return false;
    }
  }
});
