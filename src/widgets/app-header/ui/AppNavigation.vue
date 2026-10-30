<script setup lang="ts">
import { onMounted } from 'vue';
import { useSessionStore } from '@/entities/session';
import { useThemeStore } from '@/entities/theme';
import { AppButton } from '@/shared/ui';
import { useRouter } from 'vue-router';

const sessionStore = useSessionStore();
const themeStore = useThemeStore();
const router = useRouter();

onMounted(() => {
  themeStore.applyTheme();
});

const handleLogout = () => {
  sessionStore.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="flex items-center gap-4 text-sm font-medium">
    <router-link 
      to="/" 
      class="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" 
      active-class="text-emerald-600 dark:text-emerald-400 font-bold" 
      exact-active-class="text-emerald-600 dark:text-emerald-400 font-bold"
    >
      Home
    </router-link>
    <router-link 
      to="/about" 
      class="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" 
      active-class="text-emerald-600 dark:text-emerald-400 font-bold"
    >
      About Author
    </router-link>
    <router-link 
      v-if="sessionStore.isAuthenticated" 
      to="/users" 
      class="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" 
      active-class="text-emerald-600 dark:text-emerald-400 font-bold"
    >
      Users
    </router-link>

    <AppButton
      type="button"
      variant="secondary"
      @click="themeStore.toggleTheme"
    >
      {{ themeStore.isDark ? 'Light' : 'Dark' }}
    </AppButton>

    <router-link v-if="!sessionStore.isAuthenticated" to="/login">
      <AppButton variant="primary">Login</AppButton>
    </router-link>
    
    <AppButton
      v-else
      variant="danger"
      @click="handleLogout"
    >
      Logout
    </AppButton>
  </nav>
</template>