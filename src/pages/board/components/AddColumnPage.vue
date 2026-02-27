<template>
  <div class="add-column-page">
    <div class="add-column-content">
      <q-btn class="icon-wrapper" flat @click="$emit('add')">
        <q-icon name="view_column" size="48px" color="primary" />
        <div class="plus-badge">
          <q-icon name="add" size="16px" color="white" />
        </div>
      </q-btn>
      <div class="text-h6 text-grey-6 q-mt-md">Добавить колонку</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  add: [];
}>();
</script>

<style lang="scss" scoped>
.add-column-page {
  min-width: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.add-column-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: var(--color-bg-secondary);
  border: 2px dashed var(--color-border);
  cursor: pointer;
}

.plus-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: $primary;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
