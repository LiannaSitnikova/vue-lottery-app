import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useThemeStore = defineStore(
  'theme',
  () => {
    const isDark = ref(false);

    function toggleTheme() {
      isDark.value = !isDark.value;
      applyTheme();
    }

    function applyTheme() {
      if (isDark.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    return {
      isDark,
      toggleTheme,
      applyTheme,
    };
  },
  {
    persist: true,
  }
);