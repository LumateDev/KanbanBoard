import { boot } from 'quasar/wrappers';
import { useAppStore } from 'stores/app';
import { Dark } from 'quasar';
import { watch } from 'vue';

export default boot(() => {
  const appStore = useAppStore();

  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme() {
    if (appStore.themeMode === 'dark') {
      Dark.set(true);
    } else if (appStore.themeMode === 'light') {
      Dark.set(false);
    } else {
      Dark.set(media.matches);
    }
  }

  applyTheme();

  watch(
    () => appStore.themeMode,
    () => applyTheme()
  );

  media.addEventListener('change', () => {
    if (appStore.themeMode === 'system') {
      applyTheme();
    }
  });
});
