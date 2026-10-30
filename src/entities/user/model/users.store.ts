import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ServiceProvider } from '@/shared/api';
import type { UserService } from '../api/user.service';
import type { User, CreateUserDto, UpdateUserDto } from './types';

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const total = ref(0);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);
  
  const localUpdates = ref<Record<number, Partial<User>>>({});

  const hasUsers = computed(() => users.value.length > 0);
  const getUserService = () => ServiceProvider.get<UserService>('users');

  async function fetchUsers(params: { limit?: number; skip?: number; q?: string } = {}) {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      const res = await getUserService().getAll(params);
      users.value = res.users.map((user: User) => {
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

  async function fetchUserById(id: number): Promise<User> {
    if (localUpdates.value[id]) {
      const baseUser = await getUserService().getById(id);
      return { ...baseUser, ...localUpdates.value[id] };
    }
    return getUserService().getById(id);
  }

  async function createUser(data: CreateUserDto) {
    const newUser = await getUserService().create(data);
    const createdWithId = { ...newUser, ...data, id: Date.now() };
    users.value.unshift(createdWithId);
    total.value += 1;
    return createdWithId;
  }

  async function updateUser(id: number, data: UpdateUserDto) {
    await getUserService().update(id, data);
    localUpdates.value[id] = { ...(localUpdates.value[id] || {}), ...data };

    const index = users.value.findIndex(u => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...data };
    }
  }

  async function removeUser(id: number) {
    await getUserService().delete(id);
    users.value = users.value.filter(u => u.id !== id);
    total.value -= 1;
  }

  return {
    users,
    total,
    isLoading,
    errorMessage,
    hasUsers,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    removeUser,
  };
});