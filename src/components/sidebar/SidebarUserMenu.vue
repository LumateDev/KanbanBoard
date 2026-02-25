<template>
  <q-item clickable class="user-menu-item" :ripple="false">
    <q-item-section avatar>
      <q-avatar size="32px" color="primary" text-color="white">
        <q-icon name="person" size="20px" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-weight-medium text-body2"> Пользователь </q-item-label>
      <q-item-label caption> user@example.com </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon name="unfold_more" size="18px" color="grey-6" />
    </q-item-section>

    <!-- Выпадающее меню -->
    <q-menu anchor="top right" self="bottom right" :offset="[0, 8]">
      <q-list dense style="min-width: 180px">
        <q-item-label header class="text-caption text-grey-6"> Аккаунт </q-item-label>

        <q-item clickable disable v-close-popup>
          <q-item-section avatar>
            <q-icon name="person_outline" size="20px" />
          </q-item-section>
          <q-item-section>Профиль</q-item-section>
          <q-item-section side>
            <q-badge label="скоро" color="grey-6" text-color="white" />
          </q-item-section>
        </q-item>

        <q-item clickable disable v-close-popup>
          <q-item-section avatar>
            <q-icon name="settings" size="20px" />
          </q-item-section>
          <q-item-section>Настройки</q-item-section>
          <q-item-section side>
            <q-badge label="скоро" color="grey-6" text-color="white" />
          </q-item-section>
        </q-item>

        <q-separator class="q-my-xs" />

        <q-item clickable disable v-close-popup>
          <q-item-section avatar>
            <q-icon name="logout" size="20px" />
          </q-item-section>
          <q-item-section>Выйти</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script setup lang="ts">
//
</script>

<style lang="scss" scoped>
.user-menu-item {
  border-radius: 8px;
  margin: 0 0;
  min-height: 48px;
}
</style>
