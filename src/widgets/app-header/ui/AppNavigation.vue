<script setup lang="ts">
import { onMounted } from 'vue';
import { useSessionStore } from '@/entities/session';
import { useThemeStore } from '@/entities/theme';
import { BaseButton } from '@/shared/ui';
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
    <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-sky-600" active-class="text-sky-600 font-bold" exact-active-class="text-sky-600 font-bold">
      Home
    </router-link>
    <router-link to="/about" class="text-gray-600 dark:text-gray-300 hover:text-sky-600" active-class="text-sky-600 font-bold">
      About Author
    </router-link>
    <router-link v-if="sessionStore.isAuthenticated" to="/users" class="text-gray-600 dark:text-gray-300 hover:text-sky-600" active-class="text-sky-600 font-bold">
      Users
    </router-link>
    
    <BaseButton
      type="button"
      variant="secondary"
      @click="themeStore.toggleTheme"
    >
      {{ themeStore.isDark ? 'Light' : 'Dark' }}
    </BaseButton>

    <router-link v-if="!sessionStore.isAuthenticated" to="/login">
      <BaseButton variant="primary">Login</BaseButton>
    </router-link>
    
    <BaseButton
      v-else
      variant="danger"
      @click="handleLogout"
    >
      Logout
    </BaseButton>
  </nav>
</template>