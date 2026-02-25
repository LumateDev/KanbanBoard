<template>
  <q-drawer
    :model-value="appStore.sidebarOpen"
    @update:model-value="(val: boolean) => (appStore.sidebarOpen = val)"
    bordered
    :width="260"
    :breakpoint="1024"
    behavior="desktop"
  >
    <div class="sidebar-content">
      <!-- ─── Логотип + toggle ─── -->
      <div class="sidebar-header">
        <div class="row items-center no-wrap">
          <q-icon name="view_kanban" color="primary" size="28px" />
          <span class="text-h6 text-weight-bold q-ml-sm">KanbanBoard</span>
        </div>
        <q-btn flat round dense size="sm" icon="menu_open" color="grey-7" @click="appStore.toggleSidebar()" />
      </div>

      <q-separator />

      <!-- ─── Навигация ─── -->
      <q-list class="q-mt-sm">
        <q-item-label header class="sidebar-label"> Навигация </q-item-label>

        <q-item clickable active class="sidebar-item">
          <q-item-section avatar>
            <q-icon name="dashboard" size="22px" />
          </q-item-section>
          <q-item-section>Доска</q-item-section>
        </q-item>

        <q-item clickable disable class="sidebar-item">
          <q-item-section avatar>
            <q-icon name="analytics" size="22px" />
          </q-item-section>
          <q-item-section>Аналитика</q-item-section>
          <q-item-section side>
            <q-badge label="скоро" color="grey-6" text-color="white" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator class="q-my-xs" />

      <!-- ─── Настройки ─── -->
      <q-list>
        <q-item-label header class="sidebar-label"> Настройки </q-item-label>

        <q-item tag="label" class="sidebar-item">
          <q-item-section avatar>
            <q-icon :name="appStore.theme === 'dark' ? 'dark_mode' : 'light_mode'" size="22px" />
          </q-item-section>
          <q-item-section>Тёмная тема</q-item-section>
          <q-item-section side>
            <q-toggle
              :model-value="appStore.theme === 'dark'"
              @update:model-value="appStore.toggleTheme()"
              color="primary"
              dense
            />
          </q-item-section>
        </q-item>

        <q-item clickable class="sidebar-item text-negative" @click="onResetBoard">
          <q-item-section avatar>
            <q-icon name="restart_alt" size="22px" color="negative" />
          </q-item-section>
          <q-item-section>Сбросить доску</q-item-section>
        </q-item>
      </q-list>

      <q-space />

      <!-- ─── Профиль ─── -->
      <div class="sidebar-footer">
        <q-separator class="q-mb-sm" />
        <SidebarUserMenu />
      </div>
    </div>
  </q-drawer>

  <!-- ─── Кнопка + заголовок (когда sidebar скрыт) ─── -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="!appStore.sidebarOpen" class="sidebar-collapsed-header">
        <q-btn round dense color="primary" icon="menu" size="sm" @click="appStore.toggleSidebar()">
          <q-tooltip>Открыть меню</q-tooltip>
        </q-btn>
        <span class="collapsed-title">{{ boardStore.board.title }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useAppStore } from 'stores/app';
import { useBoardStore } from 'stores/board';
import SidebarUserMenu from './SidebarUserMenu.vue';

const $q = useQuasar();
const appStore = useAppStore();
const boardStore = useBoardStore();

function onResetBoard(): void {
  $q.dialog({
    title: 'Сбросить доску',
    message: 'Все колонки и карточки будут удалены. Вы уверены?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    boardStore.resetBoard();
  });
}
</script>

<style lang="scss" scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.sidebar-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: $grey-6;
  padding: 8px 16px 4px;
}

.sidebar-item {
  border-radius: 8px;
  margin: 1px 8px;
  min-height: 40px;
}

.sidebar-footer {
  padding: 0 8px 12px;
}
</style>

<style lang="scss">
.sidebar-collapsed-header {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 10px;
}

.collapsed-title {
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.7;
  white-space: nowrap;
  user-select: none;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
