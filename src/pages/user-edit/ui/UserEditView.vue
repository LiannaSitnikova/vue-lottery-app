<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ServiceProvider } from '@/shared/api';
import type { UserService } from '@/entities/user';
import { useUsersStore } from '@/entities/user';

const props = defineProps<{ id: string }>();
const router = useRouter();
const usersStore = useUsersStore();

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  age: 0,
  gender: '',
  phone: '',
});

onMounted(async () => {
  try {
    const userService = ServiceProvider.get<UserService>('users');
    const user = await userService.getById(Number(props.id));
    form.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      username: user.username || '',
      age: user.age || 0,
      gender: user.gender || '',
      phone: user.phone || '',
    };
  } catch (e: any) {
    alert('Помилка завантаження користувача: ' + e.message);
  }
});

const handleUpdate = async () => {
  try {
    await usersStore.updateUser(Number(props.id), form.value);
    router.push('/users');
  } catch (e: any) {
    alert('Помилка оновлення: ' + e.message);
  }
};

const handleCancel = () => {
  router.push('/users');
};
</script>

<template>
  <div class="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
    <h1 class="text-xl font-bold mb-6 text-gray-800 border-b pb-3">Редагувати користувача</h1>
    
    <form @submit.prevent="handleUpdate" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">First Name</label>
        <input v-model="form.firstName" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Last Name</label>
        <input v-model="form.lastName" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
        <input v-model="form.email" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Username</label>
        <input v-model="form.username" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Age</label>
        <input v-model.number="form.age" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Gender</label>
        <input v-model="form.gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
      </div>

      <div class="md:col-span-2">
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone</label>
        <input v-model="form.phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
      </div>

      <div class="md:col-span-2 flex justify-end gap-3 mt-4 border-t pt-4">
        <button 
          type="button" 
          @click="handleCancel" 
          class="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 active:bg-gray-400 transition cursor-pointer">
          Скасувати
        </button>
        <button 
          type="submit" 
          class="px-5 py-2.5 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 active:bg-sky-700 transition cursor-pointer shadow-sm">
          Оновити
        </button>
      </div>
    </form>
  </div>
</template>