<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUsersStore } from '@/entities/user';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { WinnersList } from '@/widgets/winners-list';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const isAddModalOpen = ref(false);
const limit = 8;
const page = computed(() => Number(route.query.page) || 1);
const searchQuery = ref((route.query.q as string) || '');

const winnerIds = ref<number[]>([]);

onMounted(() => {
  const savedWinners = localStorage.getItem('lottery_winner_ids');
  if (savedWinners) {
    try {
      winnerIds.value = JSON.parse(savedWinners);
    } catch (e) {
      console.error('Помилка завантаження переможців:', e);
    }
  }
  loadData();
});

watch(
  winnerIds,
  (newVal) => {
    localStorage.setItem('lottery_winner_ids', JSON.stringify(newVal));
  },
  { deep: true }
);

const winners = computed(() => {
  return usersStore.users.filter(u => winnerIds.value.includes(u.id));
});

const canSelectNewWinner = computed(() => {
  if (winnerIds.value.length >= 3) return false;
  const availableCount = usersStore.users.length - winnerIds.value.length;
  return availableCount > 0;
});

const handleNewWinner = () => {
  const available = usersStore.users.filter(u => !winnerIds.value.includes(u.id));
  if (available.length > 0 && winnerIds.value.length < 3) {
    const randomIndex = Math.floor(Math.random() * available.length);
    winnerIds.value.push(available[randomIndex].id);
  }
};

const handleRemoveWinner = (id: number) => {
  winnerIds.value = winnerIds.value.filter(wId => wId !== id);
};

const loadData = () => {
  const skip = (page.value - 1) * limit;
  usersStore.fetchUsers({ limit, skip, q: searchQuery.value });
};

watch(() => route.query, loadData);

let timeoutId: ReturnType<typeof setTimeout>;
const onSearchInput = (val: string) => {
  searchQuery.value = val;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    router.push({ query: { ...route.query, q: val || undefined, page: 1 } });
  }, 300);
};

const changePage = (newPage: number) => {
  router.push({ query: { ...route.query, page: newPage } });
};

const addUserSchema = yup.object({
  firstName: yup.string().required('Поле є обов\'язковим'),
  lastName: yup.string().required('Поле є обов\'язковим'),
  email: yup.string().required('Поле є обов\'язковим').email('Некоректний формат email'),
  username: yup.string().required('Поле є обов\'язковим'),
  password: yup.string().required('Поле є обов\'язковим').min(5, 'Мінімум 5 символів'),
  age: yup.string().required('Поле є обов\'язковим'),
  gender: yup.string().required('Поле є обов\'язковим'),
  phone: yup.string().required('Поле є обов\'язковим'),
});

const { handleSubmit, errors, resetForm, defineField } = useForm({ validationSchema: addUserSchema });
const [firstName] = defineField('firstName');
const [lastName] = defineField('lastName');
const [email] = defineField('email');
const [username] = defineField('username');
const [password] = defineField('password');
const [age] = defineField('age');
const [gender] = defineField('gender');
const [phone] = defineField('phone');

const onCreateUser = handleSubmit(async (values) => {
  try {
    await usersStore.createUser(values as any); 
    isAddModalOpen.value = false;
    resetForm();
  } catch (e: any) {
    alert('Помилка створення: ' + e.message);
  }
});

const deleteUser = async (id: number) => {
  try {
    await usersStore.removeUser(id);
    handleRemoveWinner(id); 
  } catch (e: any) {
    alert('Помилка видалення: ' + e.message);
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto">
    
    <WinnersList
      :winners="winners"
      :can-select-new-winner="canSelectNewWinner"
      @new-winner="handleNewWinner"
      @remove-winner="handleRemoveWinner"
    />

    <div class="bg-white p-6 rounded-xl shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl font-bold text-gray-800">Користувачі</h1>
        <button @click="isAddModalOpen = true" class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 active:bg-sky-700 transition cursor-pointer text-sm font-medium">Додати користувача</button>
      </div>

      <div class="mb-4">
        <input
          :value="searchQuery"
          @input="onSearchInput(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Пошук користувачів..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition"
        />
      </div>

      <div v-if="usersStore.errorMessage" class="text-center py-6 text-red-500">{{ usersStore.errorMessage }}</div>

      <div class="relative transition-opacity duration-300" :class="{ 'opacity-40 pointer-events-none': usersStore.isLoading }">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="border-b bg-gray-50 uppercase text-xs">
            <tr>
              <th class="p-3">ID</th>
              <th class="p-3">Name</th>
              <th class="p-3">Email</th>
              <th class="p-3">Username</th>
              <th class="p-3 text-center">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersStore.users" :key="user.id" class="border-b hover:bg-gray-50 transition-colors">
              <td class="p-3">{{ user.id }}</td>
              <td class="p-3">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="p-3">{{ user.email }}</td>
              <td class="p-3">{{ user.username }}</td>
              <td class="p-3 text-center flex justify-center gap-2">
                <router-link :to="`/users/${user.id}`" class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs">Переглянути</router-link>
                <router-link :to="`/users/${user.id}/edit`" class="px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 text-xs">Редагувати</router-link>
                <button @click="deleteUser(user.id)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs cursor-pointer">Видалити</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center mt-6">
        <button :disabled="page <= 1 || usersStore.isLoading" @click="changePage(page - 1)" class="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 transition cursor-pointer text-sm">Назад</button>
        <span class="text-sm font-semibold text-gray-600">Сторінка {{ page }}</span>
        <button :disabled="page * limit >= usersStore.total || usersStore.isLoading" @click="changePage(page + 1)" class="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 transition cursor-pointer text-sm">Вперед</button>
      </div>

      <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div class="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl transform transition-all">
          <h3 class="text-xl font-bold mb-6 text-gray-800 border-b pb-3">Створити нового користувача</h3>
          
          <form @submit="onCreateUser" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">First Name</label>
              <input v-model="firstName" placeholder="Введіть ім'я" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
              <span class="block text-xs text-red-500 mt-1 min-h-[16px]">{{ errors.firstName ? 'Поле є обов\'язковим' : '' }}</span>
            </div>
            
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Last Name</label>
              <input v-model="lastName" placeholder="Введіть прізвище" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
              <span class="block text-xs text-red-500 mt-1 min-h-[16px]">{{ errors.lastName ? 'Поле є обов\'язковим' : '' }}</span>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
              <input v-model="email" placeholder="example@mail.com" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
              <span class="block text-xs text-red-500 mt-1 min-h-[16px]">{{ errors.email || '' }}</span>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Username</label>
              <input v-model="username" placeholder="username" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
              <span class="block text-xs text-red-500 mt-1 min-h-[16px]">{{ errors.username ? 'Поле є обов\'язковим' : '' }}</span>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Password</label>
              <input v-model="password" type="password" placeholder="••••••••" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
              <span class="block text-xs text-red-500 mt-1 min-h-[16px]">{{ errors.password || '' }}</span>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Age</label>
              <input v-model="age" type="number" placeholder="Вік" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
              <span class="block text-xs text-red-500 mt-1 min-h-[16px]">{{ errors.age ? 'Поле є обов\'язковим' : '' }}</span>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Gender</label>
              <input v-model="gender" placeholder="male / female" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
              <span class="block text-`xs` text-red-500 mt-1 min-h-[16px]">{{ errors.gender ? 'Поле є обов\'язковим' : '' }}</span>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone</label>
              <input v-model="phone" placeholder="+380..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-500 transition" />
              <span class="block text-xs text-red-500 mt-1 min-h-[16px]">{{ errors.phone ? 'Поле є обов\'язковим' : '' }}</span>
            </div>

            <div class="md:col-span-2 flex justify-end gap-3 mt-4 border-t pt-4">
              <button 
                type="button" 
                @click="isAddModalOpen = false" 
                class="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 active:bg-gray-400 transition cursor-pointer text-sm">
                Скасувати
              </button>
              <button 
                type="submit" 
                class="px-5 py-2.5 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 active:bg-sky-700 transition cursor-pointer shadow-sm text-sm">
                Зберегти
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>