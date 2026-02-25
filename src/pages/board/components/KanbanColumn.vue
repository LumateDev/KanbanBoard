<template>
  <div class="kanban-column">
    <div class="column-header">
      <div v-if="!isEditingTitle" class="column-title" @dblclick="startEditTitle">
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

      <q-btn flat round dense size="sm" icon="more_vert" color="grey-7">
        <q-menu ref="menuRef">
          <q-list dense style="min-width: 150px">
            <q-item clickable @click="onMenuRename">
              <q-item-section avatar>
                <q-icon name="edit" size="sm" />
              </q-item-section>
              <q-item-section>Переименовать</q-item-section>
            </q-item>
            <q-separator />
            <q-item v-close-popup clickable class="text-negative" @click="$emit('deleteColumn', column.id)">
              <q-item-section avatar>
                <q-icon name="delete" size="sm" color="negative" />
              </q-item-section>
              <q-item-section>Удалить</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <div class="column-cards">
      <draggable
        :model-value="column.cards"
        group="cards"
        item-key="id"
        :animation="200"
        ghost-class="card-ghost"
        drag-class="card-drag"
        class="drag-area"
        @update:model-value="onCardsChange"
      >
        <template #item="{ element }">
          <KanbanCard
            :card="element"
            @click="$emit('editCard', column.id, element)"
            @delete="$emit('deleteCard', column.id, element.id)"
          />
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
        label="Карточка"
        size="sm"
        class="full-width"
        @click="$emit('addCard', column.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { QMenu } from 'quasar';
import draggable from 'vuedraggable';
import type { Card, Column } from 'src/types/board';
import KanbanCard from './KanbanCard.vue';

const props = defineProps<{
  column: Column;
}>();

const emit = defineEmits<{
  addCard: [columnId: string];
  editCard: [columnId: string, card: Card];
  deleteCard: [columnId: string, cardId: string];
  updateTitle: [columnId: string, title: string];
  deleteColumn: [columnId: string];
  cardsUpdated: [columnId: string, cards: Card[]];
}>();

const menuRef = ref<QMenu | null>(null);
const isEditingTitle = ref(false);
const editTitle = ref('');

function startEditTitle(): void {
  editTitle.value = props.column.title;
  isEditingTitle.value = true;
}

/** Из меню: сначала закрываем меню, потом включаем редактирование */
function onMenuRename(): void {
  menuRef.value?.hide();

  setTimeout(() => {
    startEditTitle();
    void nextTick(() => {});
  }, 150);
}
function saveTitle(): void {
  const trimmed = editTitle.value.trim();
  if (trimmed && trimmed !== props.column.title) {
    emit('updateTitle', props.column.id, trimmed);
  }
  isEditingTitle.value = false;
}

function onCardsChange(newCards: Card[]): void {
  emit('cardsUpdated', props.column.id, newCards);
}
</script>

<style lang="scss" scoped>
.kanban-column {
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 300px;
  max-height: calc(100vh - 120px);
  background: #f4f5f7;
  border-radius: 12px;
  overflow: hidden;

  .body--dark & {
    background: #2d2d2d;
  }
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 8px;
  gap: 8px;
}

.column-title {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
  min-width: 0;

  &:hover {
    opacity: 0.7;
  }
}

.column-title-input {
  flex: 1;
}

.column-cards {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
  min-height: 20px;
}

.drag-area {
  min-height: 40px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 8px;
}

.column-footer {
  padding: 6px 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  .body--dark & {
    border-top-color: rgba(255, 255, 255, 0.08);
  }
}

.card-ghost {
  opacity: 0.3;
  background: $primary;
  border-radius: 8px;
}

.card-drag {
  transform: rotate(2deg);
}
</style>

<style lang="scss">
.column-cards {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 3px;

    .body--dark & {
      background: rgba(255, 255, 255, 0.15);
    }
  }
}
</style>
