<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsersStore } from '@/entities/user';
import type { User } from '@/entities/user';
import { AppButton } from '@/shared/ui';

const props = defineProps<{ id: string }>();
const usersStore = useUsersStore();
const user = ref<User | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    user.value = await usersStore.fetchUserById(Number(props.id));
  } catch (e: any) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm transition-colors">
    <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Деталі користувача</h1>
    <div v-if="isLoading" class="text-gray-500 dark:text-gray-400">Завантаження...</div>
    <div v-else-if="user" class="space-y-2 text-gray-700 dark:text-gray-300">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Age:</strong> {{ user.age }}</p>
      <p><strong>Gender:</strong> {{ user.gender }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
      
      <div class="mt-6">
        <router-link to="/users">
          <AppButton variant="secondary">Назад до списку</AppButton>
        </router-link>
      </div>
    </div>
  </div>
</template>