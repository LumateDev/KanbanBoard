<template>
  <q-item clickable :to="to" exact class="sidebar-item" active-class="sidebar-item--active">
    <q-item-section avatar>
      <q-icon :name="icon" size="20px" />
    </q-item-section>

    <q-item-section v-if="!mini">
      {{ label }}
    </q-item-section>

    <q-tooltip v-if="mini" anchor="center right" self="center left" :offset="[8, 0]">
      {{ label }}
    </q-tooltip>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  to: string;
  mini: boolean;
}>();
</script>

<style scoped lang="scss">
.sidebar-item {
  border-radius: 10px;
  margin: 4px 8px;
  transition:
    background 0.2s,
    color 0.2s;
  color: var(--color-nav-inactive);

  &:hover {
    background: var(--color-hover);
  }
}

.sidebar-item--active {
  background: var(--color-active-bg);
  color: $primary;

  &:hover {
    background: var(--color-active-bg-hover);
  }
}
</style>
