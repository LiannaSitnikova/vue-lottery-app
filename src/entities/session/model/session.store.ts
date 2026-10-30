import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ServiceProvider } from '@/shared/api';
import type { AuthService } from '../api/auth.service';
import type { User } from '@/entities/user';

export const useSessionStore = defineStore(
  'session',
  () => {
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => !!accessToken.value);

    const getAuthService = () => ServiceProvider.get<AuthService>('auth');

    function setSession(tokens: { accessToken: string; refreshToken: string }, userData?: User) {
      accessToken.value = tokens.accessToken;
      refreshToken.value = tokens.refreshToken;
      if (userData) {
        user.value = userData;
      }
    }

    function clearSession() {
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;
    }

    async function login(username: string, pass: string) {
      const res = await getAuthService().login(username, pass);
      const userData: User = {
        id: res.id,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        username: res.username,
        gender: res.gender,
        age: 25,
        phone: '+380000000000',
      };
      setSession({ accessToken: res.accessToken, refreshToken: res.refreshToken }, userData);
    }

    async function fetchCurrentUser() {
      if (!accessToken.value) return;
      try {
        user.value = await getAuthService().getCurrentUser();
      } catch {
        clearSession();
      }
    }

    function logout() {
      clearSession();
    }

    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated,
      setSession,
      clearSession,
      login,
      logout,
      fetchCurrentUser,
    };
  },
  {
    persist: true, 
}
);