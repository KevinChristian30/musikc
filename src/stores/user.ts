import { auth, usersCollection } from '@/plugins/firebase';
import { defineStore } from 'pinia';

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register(values: any) {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      await usersCollection.doc(userCredentials.user?.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      });

      await userCredentials.user?.updateProfile({
        displayName: values.name,
      });

      this.userLoggedIn = true;
    }
  }
});
