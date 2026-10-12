<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ServiceProvider } from '../services/service-provider';
import type { User } from '../types';

const props = defineProps<{ id: string }>();
const user = ref<User | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    user.value = await ServiceProvider.users.getById(Number(props.id));
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h1 class="text-2xl font-bold mb-4">Деталі користувача</h1>
    <div v-if="isLoading">Завантаження...</div>
    <div v-else-if="user" class="space-y-2">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Age:</strong> {{ user.age }}</p>
      <p><strong>Gender:</strong> {{ user.gender }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
      <router-link to="/users" class="inline-block mt-4 px-4 py-2 bg-gray-200 rounded text-sm">Назад до списку</router-link>
    </div>
  </div>
</template>