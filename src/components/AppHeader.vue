<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto w-full flex justify-start items-center py-5 px-4">
      <a class="text-white font-bold text-2xl mr-4" href="#">MusiKC</a>

      <div class="flex flex-grow items-center justify-end">
        <ul class="flex flex-row mt-1">
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <a class="px-2 text-white" href="#">Manage</a>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logOut">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores, mapState, mapActions } from 'pinia';
import useModalStore from '@/stores/modal';
import userUserStore from '@/stores/user';

export default {
  name: 'AppHeader',
  computed: {
    ...mapStores(useModalStore),
    ...mapState(userUserStore, ['userLoggedIn'])
  },
  methods: {
    ...mapActions(userUserStore, ['signOut']),
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
    },
    async logOut() {
      await this.signOut();

      window.location.reload();
    }
  }
};
</script>
