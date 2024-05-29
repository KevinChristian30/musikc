<template>
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <button
          @click.prevent="newSong(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>

    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">{{
            $tc('song.comment_count', { count: song.comment_count })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            v-if="comment_show_alert"
            class="text-white text-center font-bold p-4 mb-4"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>

          <vee-form :validation-schema="formSchema" @submit="addComment" v-if="userLoggedIn">
            <vee-field
              name="comment"
              as="textarea"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <error-message name="comment" class="text-red-600"></error-message>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>

          <select
            v-model="order"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>

    <ul class="container mx-auto" v-for="comment in sortedComments" :key="comment.id">
      <li class="p-6 bg-gray-50 border border-gray-200">
        <div class="mb-5">
          <div class="font-bold">{{ comment.commenterName }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { auth, commentsCollection, songsCollection } from '@/plugins/firebase';
import { mapActions, mapState } from 'pinia';
import useUserStore from '@/stores/user';
import usePlayerStore from '@/stores/player';

export default {
  name: 'SongView',
  data() {
    return {
      song: {},
      formSchema: {
        comment: 'required|min:3'
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! your comment is being saved',
      comments: [],
      order: '1'
    };
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.order === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    resetAlert() {
      this.comment_in_submission = false;
      this.comment_show_alert = false;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_message = 'Please wait! your comment is being saved';
    },
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_message = 'Please wait! your comment is being saved';

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        songId: this.$route.params.id,
        userId: auth.currentUser.uid,
        commenterName: auth.currentUser.displayName
      };

      try {
        await commentsCollection.add(comment);
        this.song.comment_count++;
        await songsCollection.doc(this.$route.params.id).update({
          comment_count: this.song.comment_count
        });
      } catch (error) {
        this.comment_in_submission = false;
        this.comment_show_alert = true;
        this.comment_alert_variant = 'bg-red-500';
        this.comment_alert_message = 'Something went wrong, please try again later';

        return;
      }

      this.comment_in_submission = false;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-green-500';
      this.comment_alert_message = 'Comment added';

      this.getComments();
      resetForm();
      setTimeout(() => resetAlert(), 2000);
    },
    async getComments() {
      const snapshots = await commentsCollection.where('songId', '==', this.$route.params.id).get();
      this.comments = [];

      snapshots.forEach((doc) => {
        this.comments.push({
          id: doc.id,
          ...doc.data()
        });
      });
    }
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get();

    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' });
      return;
    }

    const { order } = this.$route.query;
    this.order = order === '1' || order === '2' ? order : '1';

    this.song = docSnapshot.data();
    await this.getComments();
  },
  watch: {
    order(newVal) {
      if (newVal === this.$route.query.order) {
        return;
      }

      this.$router.push({
        query: {
          order: newVal
        }
      });
    }
  }
};
</script>
