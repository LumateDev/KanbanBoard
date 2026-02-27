<template>
  <q-page class="desktop-board">
    <div class="board-columns">
      <KanbanColumn v-for="column in boardStore.board.columns" :key="column.id" :column="column" />

      <q-btn flat round dense icon="add" color="primary" size="lg" class="add-column-btn" @click="onAddColumn">
        <q-tooltip>Добавить колонку</q-tooltip>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useBoardStore } from 'stores/board';
import { useAppDialog } from 'src/composables/useAppDialog';
import KanbanColumn from './KanbanColumn.vue';

const boardStore = useBoardStore();
const { promptText } = useAppDialog();

async function onAddColumn(): Promise<void> {
  const title = await promptText({
    title: 'Новая колонка',
    message: 'Введите название:',
  });
  if (title) boardStore.addColumn(title);
}
</script>

<style lang="scss" scoped>
.desktop-board {
  height: 0;
  display: flex;
  overflow: hidden;
}

.board-columns {
  display: flex;
  gap: 16px;
  align-items: stretch;
  padding: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  min-width: 0;
}

.add-column-btn {
  margin-top: 8px;
  opacity: 0.5;
  transition: opacity 0.2s;
  flex-shrink: 0;
  width: 48px;
  height: 48px;

  &:hover {
    opacity: 1;
  }
}
</style>
