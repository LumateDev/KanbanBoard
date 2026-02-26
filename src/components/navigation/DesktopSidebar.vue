<template>
  <q-drawer :model-value="true" :mini="isMini" :mini-width="72" :width="260" bordered :breakpoint="0" class="sidebar">
    <div class="sidebar-inner">
      <!-- Header -->
      <div class="sidebar-header">
        <template v-if="!isMini">
          <div class="sidebar-title">KanbanBoard</div>
        </template>

        <q-btn
          flat
          round
          dense
          size="md"
          :icon="isMini ? 'chevron_right' : 'chevron_left'"
          class="sidebar-toggle"
          @click="appStore.toggleSidebar()"
        />
      </div>

      <q-separator class="separator" />

      <!-- Main nav -->
      <q-list padding>
        <SidebarItem icon="dashboard" label="Доска" to="/" :mini="isMini" />
        <SidebarItem icon="bar_chart" label="Аналитика" to="/analytics" :mini="isMini" />
      </q-list>

      <q-space />

      <!-- Bottom nav -->
      <q-separator class="separator" />

      <q-list padding>
        <SidebarItem icon="settings" label="Настройки" to="/settings" :mini="isMini" />
        <SidebarItem icon="person" label="Профиль" to="/profile" :mini="isMini" />
      </q-list>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from 'stores/app';
import SidebarItem from './SidebarItem.vue';

const appStore = useAppStore();

const isMini = computed(() => !appStore.sidebarOpen);
</script>

<style scoped lang="scss">
.sidebar {
  background: var(--color-bg-primary);
}

.separator {
  background: var(--color-border);
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 16px;
  min-height: 56px;

  // Свёрнутый: кнопка по центру
  justify-content: center;
}

// Развёрнутый: заголовок слева, кнопка справа
.sidebar-title + .sidebar-toggle {
  margin-left: auto;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.sidebar-toggle {
  color: var(--color-text-secondary);
}
</style>
