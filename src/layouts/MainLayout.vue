<template>
  <q-layout view="lHh LpR lFf">
    <DesktopSidebar v-if="isDesktop" />

    <q-page-container>
      <router-view class="main-content" />
    </q-page-container>

    <MobileBottomNav v-if="!isDesktop" />
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import DesktopSidebar from 'src/components/navigation/DesktopSidebar.vue';
import MobileBottomNav from 'src/components/navigation/MobileBottomNav.vue';

const $q = useQuasar();
const isDesktop = computed(() => $q.screen.width >= 600);
</script>

<style scoped>
.main-content {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
