<template>
  <div class="kanban-column">
    <div class="column-header">
      <div v-if="!isEditingTitle" class="column-title" @click="startEditTitle">
        <span class="text-subtitle1 text-weight-bold ellipsis">
          {{ column.title }}
        </span>
        <q-badge color="grey-6" :label="column.cards.length" class="q-ml-sm" />
      </div>

      <q-input
        v-else
        v-model="editTitle"
        dense
        autofocus
        class="column-title-input"
        @keyup.enter="saveTitle"
        @blur="saveTitle"
      >
        <template #append>
          <q-icon name="check" class="cursor-pointer" @click="saveTitle" />
        </template>
      </q-input>

      <q-btn flat round dense size="sm" icon="delete" color="negative" class="delete-btn" @click="onDeleteColumn">
        <q-tooltip>Удалить колонку</q-tooltip>
      </q-btn>
    </div>

    <div class="column-cards">
      <draggable
        :list="column.cards"
        group="cards"
        item-key="id"
        :animation="200"
        ghost-class="card-ghost"
        drag-class="card-drag"
        class="drag-area"
        @change="onDragChange"
      >
        <template #item="{ element }">
          <KanbanCard :card="element" :column-id="column.id" />
        </template>
      </draggable>
    </div>

    <div class="column-footer">
      <q-btn
        flat
        dense
        no-caps
        color="primary"
        icon="add"
        label="Добавить карточку"
        size="md"
        class="full-width"
        @click="onAddCard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { useBoardStore } from 'stores/board';
import { useAppDialog } from 'src/composables/useAppDialog';
import type { Column } from 'src/types/board';
import KanbanCard from './KanbanCard.vue';

const props = defineProps<{
  column: Column;
}>();

const boardStore = useBoardStore();
const { promptText, confirm } = useAppDialog();

const isEditingTitle = ref(false);
const editTitle = ref('');

function startEditTitle(): void {
  editTitle.value = props.column.title;
  isEditingTitle.value = true;
}

function saveTitle(): void {
  const trimmed = editTitle.value.trim();
  if (trimmed && trimmed !== props.column.title) {
    boardStore.updateColumnTitle(props.column.id, trimmed);
  }
  isEditingTitle.value = false;
}

async function onDeleteColumn(): Promise<void> {
  const n = props.column.cards.length;
  const message =
    n > 0 ? `В колонке ${n} карточ${n === 1 ? 'ка' : n < 5 ? 'ки' : 'ек'}. Удалить?` : 'Удалить пустую колонку?';

  const ok = await confirm({ title: 'Удалить колонку', message });
  if (ok) boardStore.removeColumn(props.column.id);
}

function onDragChange(): void {
  boardStore.updateColumnCards(props.column.id, [...props.column.cards]);
}

async function onAddCard(): Promise<void> {
  const title = await promptText({
    title: 'Новая карточка',
    message: 'Введите заголовок:',
  });
  if (title) {
    boardStore.addCard(props.column.id, title);
  }
}
</script>

<style lang="scss" scoped>
.kanban-column {
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 300px;
  max-width: 420px;
  flex-shrink: 0;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  min-height: 0;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 8px;
  gap: 8px;
  flex-shrink: 0;
}

.column-title {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: var(--color-hover);
  }
}

.column-title-input {
  flex: 1;
}

.delete-btn {
  opacity: 0.4;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

.column-cards {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 8px;
}

.drag-area {
  min-height: 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 8px;
}

.column-footer {
  padding: 8px;
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

.card-ghost {
  opacity: 0.4;
  background: var(--color-active-bg);
  border: 2px dashed var(--color-border);
  border-radius: 8px;
}

.card-drag {
  transform: rotate(2deg);
  box-shadow: var(--shadow-elevated);
  opacity: 0.9;
}
</style>
