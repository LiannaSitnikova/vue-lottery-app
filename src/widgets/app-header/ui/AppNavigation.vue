<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="flex items-center gap-6 text-sm font-medium">
    <router-link to="/" class="text-gray-600 hover:text-sky-600" active-class="text-sky-600 font-bold" exact-active-class="text-sky-600 font-bold">Home</router-link>
    <router-link to="/about" class="text-gray-600 hover:text-sky-600" active-class="text-sky-600 font-bold">About Author</router-link>
    <router-link v-if="authStore.isAuthenticated" to="/users" class="text-gray-600 hover:text-sky-600" active-class="text-sky-600 font-bold">Users</router-link>
    
    <router-link v-if="!authStore.isAuthenticated" to="/login" class="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">Login</router-link>
    <button 
      v-else 
      @click="handleLogout" 
      class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer shadow-sm">
      Logout
    </button>
    </nav>
</template>