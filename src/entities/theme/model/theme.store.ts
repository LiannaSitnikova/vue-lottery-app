import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useThemeStore = defineStore(
  'theme',
  () => {
    const isDark = ref(false);

    function applyTheme() {
      if (isDark.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    function toggleTheme() {
      isDark.value = !isDark.value;
      applyTheme();
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