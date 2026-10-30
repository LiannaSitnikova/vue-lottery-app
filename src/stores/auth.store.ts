import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/entities/user';
import { ServiceProvider } from '@/shared/api';
import type { AuthService } from '@/entities/session';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'));

  const isAuthenticated = computed(() => !!accessToken.value);

  const getAuthService = () => ServiceProvider.get<AuthService>('auth');

  function setTokens(access: string, refresh: string) {
    accessToken.value = access;
    refreshToken.value = refresh;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }

  function clearAuth() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async function login(username: string, pass: string) {
    const res = await getAuthService().login(username, pass);
    setTokens(res.accessToken, res.refreshToken);
    user.value = {
      id: res.id,
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      username: res.username,
      gender: res.gender,
      age: 25,
      phone: '+380000000000',
    };
  }

  async function fetchCurrentUser() {
    if (!accessToken.value) return;
    try {
      user.value = await getAuthService().getCurrentUser();
    } catch {
      clearAuth();
    }
  }

  function logout() {
    clearAuth();
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    logout,
    fetchCurrentUser,
  };
});