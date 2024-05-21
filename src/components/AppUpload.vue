<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>

    <div class="p-6">
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDraggedOver }"
        @drag.prevent.stop="console.log(1)"
        @dragstart.prevent.stop="console.log(1)"
        @dragend.prevent.stop="isDraggedOver = false"
        @dragover.prevent.stop="isDraggedOver = true"
        @dragenter.prevent.stop="isDraggedOver = true"
        @dragleave.prevent.stop="isDraggedOver = false"
        @drop.prevent.stop="upload"
      >
        <h5>Drop your files here</h5>
      </div>

      <input type="file" multiple @change="upload($event)" />

      <hr class="my-6" />

      <div class="mb-4" v-for="upload in uploads" :key="upload.name" :class="upload.text_class">
        <div class="font-bold text-sm"><i :class="upload.icon"></i> {{ upload.name }}</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="upload.variant"
            :style="{ width: upload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, songsCollection, storage } from '@/plugins/firebase';

export default {
  name: 'AppUpload',
  data() {
    return {
      isDraggedOver: false,
      uploads: []
    };
  },
  methods: {
    upload($event) {
      this.isDraggedOver = false;

      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];
      files.forEach((file) => {
        if (file.type !== 'audio/ogg' && file.type !== 'audio/mp3' && file.type !== 'audio/x-m4a') {
          return;
        }

        const storageRef = storage.ref();
        const songsRef = storageRef.child(`songs/${file.name}`);
        const task = songsRef.put(file);

        const uploadIndex =
          this.uploads.push({
            task,
            currentProgress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            text_class: ''
          }) - 1;

        task.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].currentProgress = progress;
          },
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].text_class = 'text-red-400';
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0,
              url: await task.snapshot.ref.getDownloadURL()
            };

            await songsCollection.add(song);

            this.uploads[uploadIndex].variant = 'bg-green-400';
            this.uploads[uploadIndex].icon = 'fas fa-check';
            this.uploads[uploadIndex].text_class = 'text-green-400';
          }
        );
      });
    }
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  }
};
</script>
