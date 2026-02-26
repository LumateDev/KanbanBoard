<template>
  <q-page class="settings-page">
    <div class="settings-container">
      <!-- HEADER -->
      <div class="settings-header">
        <div class="text-h4 text-weight-bold">Настройки</div>
        <div class="settings-subtitle">Управление приложением и персонализация</div>
      </div>

      <!-- APPEARANCE -->
      <section class="settings-section">
        <div class="section-label">Внешний вид</div>

        <q-card flat bordered class="settings-card">
          <q-list>
            <q-item class="settings-item row items-center no-wrap">
              <div class="row items-center col">
                <div class="item-avatar">
                  <q-icon name="palette" size="20px" color="primary" />
                </div>

                <q-item-label class="text-weight-medium q-ml-sm"> Тема </q-item-label>
              </div>

              <q-btn-toggle
                v-model="appStore.themeMode"
                no-caps
                unelevated
                toggle-color="primary"
                :options="themeOptions"
                class="theme-toggle"
              />
            </q-item>
          </q-list>
        </q-card>
      </section>

      <!-- ABOUT -->
      <section class="settings-section">
        <div class="section-label">О приложении</div>

        <q-card flat bordered class="settings-card">
          <q-list>
            <q-item class="settings-item">
              <q-item-section avatar class="item-avatar">
                <q-icon name="info" size="20px" color="primary" />
              </q-item-section>

              <q-item-section>
                <q-item-label> Версия </q-item-label>
                <q-item-label caption>
                  {{ appVersion }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </section>

      <!-- DANGER -->
      <section class="settings-section">
        <div class="section-label text-negative">Danger Zone</div>

        <q-card flat bordered class="settings-card danger-card">
          <q-list>
            <q-item clickable class="settings-item" @click="handleResetBoard">
              <q-item-section avatar class="item-avatar">
                <q-icon name="restart_alt" size="20px" color="negative" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-negative"> Очистить доску </q-item-label>
                <q-item-label caption> Удаляет все колонки и карточки </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="chevron_right" size="18px" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAppStore } from 'stores/app';
import { useBoardStore } from 'stores/board';
import { useAppDialog } from 'src/composables/useAppDialog';

const appStore = useAppStore();
const boardStore = useBoardStore();
const { confirm } = useAppDialog();

const appVersion = process.env.APP_VERSION;

const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

async function handleResetBoard() {
  const ok = await confirm({
    title: 'Очистить доску?',
    message: 'Все данные будут безвозвратно удалены.',
  });

  if (ok) boardStore.resetBoard();
}
</script>

<style scoped lang="scss">
.settings-page {
  display: flex;
  justify-content: center;
  padding: 48px 20px 64px;
}

.settings-container {
  width: 100%;
  max-width: 720px;
}

.settings-header {
  margin-bottom: 40px;
}

.settings-subtitle {
  color: var(--color-text-secondary);
}

.settings-section {
  margin-bottom: 36px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: var(--color-text-muted);
}

.settings-card {
  border-radius: 14px;
  background: var(--color-bg-elevated);
  border-color: var(--color-border);
}

.settings-item {
  padding-left: 12px;
  padding-right: 12px;
}

.item-avatar {
  min-width: 28px;
  padding-right: 6px;
}

.theme-toggle {
  border-radius: 999px;
  border: 1px solid var(--color-border);
  min-width: 220px;

  ::v-deep .q-btn {
    flex: 1;
    min-width: 0;
    padding: 6px 8px;
    font-weight: 500;
    justify-content: center;
    text-align: center;
  }
}
.danger-card {
  border-color: rgba($negative, 0.3);
}
</style>
