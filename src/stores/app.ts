import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { watch } from 'vue';
import { Dark } from 'quasar';

type Theme = 'light' | 'dark';

export const useAppStore = defineStore('app', () => {
  const theme = useStorage<Theme>('app-theme', 'light');
  const sidebarOpen = useStorage<boolean>('sidebar-open', true);

  function setTheme(newTheme: Theme): void {
    theme.value = newTheme;
  }

  function toggleTheme(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value;
  }

  watch(
    theme,
    (val) => {
      Dark.set(val === 'dark');
    },
    { immediate: true }
  );

  return {
    theme,
    sidebarOpen,
    setTheme,
    toggleTheme,
    toggleSidebar,
  };
});
