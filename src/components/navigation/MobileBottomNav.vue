<template>
  <q-footer class="mobile-footer">
    <div class="mobile-nav-wrapper">
      <q-tabs dense align="justify" active-color="primary" indicator-color="primary" class="mobile-tabs">
        <q-route-tab to="/" exact icon="dashboard" label="Доска" />
        <q-route-tab to="/analytics" icon="bar_chart" label="Аналитика" />
        <q-route-tab to="/settings" icon="settings" label="Настройки" />
        <q-route-tab to="/profile" icon="person" label="Профиль" />
      </q-tabs>
    </div>
  </q-footer>
</template>

<style scoped lang="scss">
.mobile-footer {
  background: transparent;
  padding-bottom: 8px;
}

.mobile-nav-wrapper {
  margin: 0 16px 12px;
  border-radius: 24px;
  overflow: hidden;
  background: var(--color-nav-bg);
  box-shadow: var(--shadow-elevated);
}

.mobile-tabs {
  height: 60px;
}

// Неактивные табы — цвет из CSS-переменной, работает в обеих темах
.mobile-tabs :deep(.q-tab) {
  color: var(--color-nav-inactive);
}

.mobile-tabs :deep(.q-tab__label) {
  font-size: 12px;
}

@media (max-width: 400px) {
  .mobile-tabs {
    height: 52px;
  }

  .mobile-tabs :deep(.q-tab__icon) {
    font-size: 18px;
  }

  .mobile-tabs :deep(.q-tab__label) {
    font-size: 10px;
  }
}
</style>
