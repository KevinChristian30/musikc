<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <router-link
        :to="{ name: 'songs', params: { id: song.id } }"
        class="font-bold block text-gray-600"
        >{{ song.modified_name }}</router-link
      >
      <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link
        :to="{ name: 'songs', params: { id: song.id }, hash: '#comments' }"
        v-slot="{ navigate }"
        class="font-bold block text-gray-600"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.comment_count }}
        </span>
      </router-link>
    </div>
  </li>
</template>

<script>
export default {
  name: 'AppSongItem',
  props: {
    song: {
      type: Object,
      required: true
    }
  }
};
</script>
