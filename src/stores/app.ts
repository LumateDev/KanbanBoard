import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export type ThemeMode = 'system' | 'light' | 'dark';

export const useAppStore = defineStore('app', () => {
  const themeMode = useStorage<ThemeMode>('app-theme-mode', 'system');
  const sidebarOpen = useStorage<boolean>('sidebar-open', true);

  function setThemeMode(mode: ThemeMode) {
    themeMode.value = mode;
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  return {
    themeMode,
    sidebarOpen,
    setThemeMode,
    toggleSidebar,
  };
});
