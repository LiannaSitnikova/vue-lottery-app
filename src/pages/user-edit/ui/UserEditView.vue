<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/entities/user';
import { AppButton, AppInput } from '@/shared/ui';

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
    const user = await usersStore.fetchUserById(Number(props.id));
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
  <div class="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm max-w-2xl mx-auto transition-colors">
    <h1 class="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-slate-700 pb-3">
      Редагувати користувача
    </h1>
    
    <form @submit.prevent="handleUpdate" class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
      <AppInput v-model="form.firstName" label="First Name" />
      <AppInput v-model="form.lastName" label="Last Name" />
      <AppInput v-model="form.email" label="Email" />
      <AppInput v-model="form.username" label="Username" />
      <AppInput v-model.number="form.age" label="Age" type="number" />
      <AppInput v-model="form.gender" label="Gender" />
      
      <div class="md:col-span-2">
        <AppInput v-model="form.phone" label="Phone" />
      </div>

      <div class="md:col-span-2 flex justify-end gap-3 mt-4 border-t dark:border-slate-700 pt-4">
        <AppButton type="button" variant="secondary" @click="handleCancel">
          Скасувати
        </AppButton>
        <AppButton type="submit" variant="primary">
          Оновити
        </AppButton>
      </div>
    </form>
  </div>
</template>