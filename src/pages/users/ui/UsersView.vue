<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUsersStore } from '@/entities/user';
import { WinnersList } from '@/widgets/winners-list';
import { UserForm } from '@/features/user-form';
import { AppButton, AppInput } from '@/shared/ui';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const toast = useToast();
const confirm = useConfirm();

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
const onSearchInput = (val: string | number) => {
  const strVal = String(val);
  searchQuery.value = strVal;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    router.push({ query: { ...route.query, q: strVal || undefined, page: 1 } });
  }, 300);
};

const changePage = (newPage: number) => {
  router.push({ query: { ...route.query, page: newPage } });
};

const onCreateUser = async (values: any) => {
  try {
    await usersStore.createUser(values); 
    isAddModalOpen.value = false;
    toast.add({ severity: 'success', summary: 'Успіх', detail: 'Користувача успішно створено!', life: 3000 });
  } catch (e: any) {
    toast.add({ severity: 'error', summary: 'Помилка', detail: e.message || 'Не вдалося створити користувача', life: 3000 });
  }
};

const deleteUser = (id: number) => {
  confirm.require({
    message: 'Ви впевнені, що хочете видалити цього користувача?',
    header: 'Підтвердження видалення',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Скасувати',
    acceptLabel: 'Видалити',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await usersStore.removeUser(id);
        handleRemoveWinner(id); 
        toast.add({ severity: 'info', summary: 'Видалено', detail: 'Користувача видалено', life: 3000 });
      } catch (e: any) {
        toast.add({ severity: 'error', summary: 'Помилка', detail: e.message || 'Не вдалося видалити', life: 3000 });
      }
    }
  });
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

    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm transition-colors">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Користувачі</h1>
        <AppButton variant="primary" @click="isAddModalOpen = true">
          Додати користувача
        </AppButton>
      </div>

      <div class="mb-4">
        <AppInput
          :model-value="searchQuery"
          placeholder="Пошук користувачів..."
          @update:model-value="onSearchInput"
        />
      </div>

      <div v-if="usersStore.errorMessage" class="text-center py-6 text-red-500">{{ usersStore.errorMessage }}</div>

      <div class="relative transition-opacity duration-300" :class="{ 'opacity-40 pointer-events-none': usersStore.isLoading }">
        <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead class="border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-700 uppercase text-xs">
            <tr>
              <th class="p-3">ID</th>
              <th class="p-3">Name</th>
              <th class="p-3">Email</th>
              <th class="p-3">Username</th>
              <th class="p-3 text-center">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersStore.users" :key="user.id" class="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <td class="p-3">{{ user.id }}</td>
              <td class="p-3">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="p-3">{{ user.email }}</td>
              <td class="p-3">{{ user.username }}</td>
              <td class="p-3 text-center flex justify-center gap-2">
                <router-link :to="`/users/${user.id}`">
                  <AppButton variant="secondary" size="small">Переглянути</AppButton>
                </router-link>
                <router-link :to="`/users/${user.id}/edit`">
                  <AppButton variant="primary" size="small">Редагувати</AppButton>
                </router-link>
                <AppButton variant="danger" size="small" @click="deleteUser(user.id)">Видалити</AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center mt-6">
        <AppButton 
          variant="secondary" 
          :disabled="page <= 1 || usersStore.isLoading" 
          @click="changePage(page - 1)"
        >
          Назад
        </AppButton>

        <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">Сторінка {{ page }}</span>

        <AppButton 
          variant="secondary" 
          :disabled="page * limit >= usersStore.total || usersStore.isLoading" 
          @click="changePage(page + 1)"
        >
          Вперед
        </AppButton>
      </div>

      <!-- Модальне вікно із використанням фічі UserForm -->
      <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-2xl transform transition-all">
          <h3 class="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-slate-700 pb-3">
            Створити нового користувача
          </h3>
          
          <UserForm @submit="onCreateUser" @cancel="isAddModalOpen = false" />
        </div>
      </div>
    </div>
  </div>
</template>