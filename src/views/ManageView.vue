<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload></app-upload>
      </div>

      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>

          <div class="p-6" v-for="(song, index) in songs" :key="song.id">
            <app-composition-item
              :song="song"
              :updateParentSong="updateSong"
              :index="index"
            ></app-composition-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppCompositionItem from '@/components/AppCompositionItem.vue';
import AppUpload from '@/components/AppUpload.vue';
import { auth, songsCollection } from '@/plugins/firebase';

export default {
  name: 'Manage',
  components: {
    AppUpload,
    AppCompositionItem
  },
  data() {
    return {
      songs: []
    };
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modified_name = values.modified_name;
      this.songs[index].genre = values.genre;
    }
  },
  async created() {
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get();
    snapshot.forEach((document) => {
      const song = {
        ...document.data(),
        id: document.id
      };

      this.songs.push(song);
    });
  }
};
</script>
