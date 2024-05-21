<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4 rounded-sm"
        v-if="showAlert"
        :class="alertVariant"
      >
        {{ alertMessage }}
      </div>

      <vee-form :validation-schema="schema" @submit="updateSong" :initial-values="initialValues">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            name="modified_name"
          />
          <error-message class="text-red-500" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            name="genre"
          />
          <error-message class="text-red-500" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600 mr-4"
          :disabled="inSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
          :disabled="inSubmission"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection } from '@/plugins/firebase';

export default {
  name: 'AppCompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    updateParentSong: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      initialValues: {
        modified_name: this.song.modified_name,
        genre: this.song.genre
      },
      inSubmission: false,
      showAlert: false,
      alertVariant: 'bg-blue-500',
      alertMessage: 'Please wait, updating song info'
    };
  },
  methods: {
    resetAlert() {
      this.inSubmission = false;
      this.showAlert = false;
      this.alertVariant = 'bg-blue-500';
      this.alertMessage = 'Please wait, updating song info';
    },
    async updateSong(values) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = 'bg-blue-500';
      this.alertMessage = 'Please wait, updating song info';

      try {
        await songsCollection.doc(this.song.id).update({
          modified_name: values.modified_name,
          genre: values.genre
        });
      } catch (error) {
        this.inSubmission = false;
        this.alertVariant = 'bg-red-500';
        this.alertMessage = 'Something went wrong, please try again';
        return;
      }

      this.inSubmission = false;
      this.alertVariant = 'bg-green-500';
      this.alertMessage = 'Song updated';
      this.updateParentSong(this.index, values);
      setTimeout(this.resetAlert, 2000);
    }
  }
};
</script>
