<template>
  <q-layout view="lHh LpR lFf">
    <DesktopSidebar v-if="isDesktop" />

    <q-page-container :class="{ 'safe-area': isCapacitor }">
      <router-view />
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
const isCapacitor = computed(() => $q.platform.is.capacitor);
</script>

<style lang="scss">
.safe-area > .q-page {
  padding-top: var(--safe-area-inset-top, 0px);
  padding-bottom: var(--safe-area-inset-bottom, 0px);
  padding-left: var(--safe-area-inset-left, 0px);
  padding-right: var(--safe-area-inset-right, 0px);
  box-sizing: border-box;
}
</style>
