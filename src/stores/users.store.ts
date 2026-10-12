import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, CreateUserDto, UpdateUserDto } from '../types';
import { ServiceProvider } from '../services/service-provider';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const total = ref(0);
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  const localUpdates = ref<Record<number, Partial<User>>>({});

  async function fetchUsers(params: { limit?: number; skip?: number; q?: string } = {}) {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const res = await ServiceProvider.users.getAll(params);
      
      users.value = res.users.map(user => {
        if (localUpdates.value[user.id]) {
          return { ...user, ...localUpdates.value[user.id] };
        }
        return user;
      });
      
      total.value = res.total;
    } catch (e: any) {
      errorMessage.value = e.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function addUser(data: CreateUserDto) {
    const newUser = await ServiceProvider.users.create(data);
    const createdWithId = { ...newUser, ...data, id: Date.now() };
    users.value.unshift(createdWithId);
    total.value += 1;
  }

  async function updateUser(id: number, data: UpdateUserDto) {
    await ServiceProvider.users.update(id, data);
    
    localUpdates.value[id] = data;

    const index = users.value.findIndex(u => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...data };
    }
  }

  async function removeUser(id: number) {
    await ServiceProvider.users.delete(id);
    users.value = users.value.filter(u => u.id !== id);
    total.value -= 1;
  }

  return {
    users,
    total,
    isLoading,
    errorMessage,
    fetchUsers,
    addUser,
    updateUser,
    removeUser,
  };
});