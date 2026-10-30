<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsersStore } from '@/entities/user';
import type { User } from '@/entities/user';

const props = defineProps<{ id: string }>();
const usersStore = useUsersStore();
const user = ref<User | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    user.value = await usersStore.fetchUserById(Number(props.id));
  } catch (e) {
    console.error('Помилка завантаження користувача:', e);
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