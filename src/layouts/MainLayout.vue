<template>
  <q-layout view="lHh LpR fFf">
    <AppSidebar />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppSidebar from 'src/components/sidebar/AppSidebar.vue';
</script>
