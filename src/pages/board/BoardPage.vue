<template>
  <q-page class="board-page">
    <div class="board-scroll-container">
      <div class="board-columns">
        <KanbanColumn
          v-for="column in boardStore.board.columns"
          :key="column.id"
          :column="column"
          @add-card="onAddCard"
          @edit-card="onEditCard"
          @delete-card="onDeleteCard"
          @update-title="onUpdateColumnTitle"
          @delete-column="onDeleteColumn"
          @cards-updated="onCardsUpdated"
        />

        <q-btn flat round dense icon="add" color="grey-5" size="md" class="add-column-btn" @click="onAddColumn">
          <q-tooltip>Добавить колонку</q-tooltip>
        </q-btn>
      </div>
    </div>

    <CardDialog v-model="cardDialogVisible" :card="editingCard" :mode="cardDialogMode" @save="onSaveCard" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useBoardStore } from 'stores/board';
import type { Card } from 'src/types/board';
import KanbanColumn from './components/KanbanColumn.vue';
import CardDialog from './components/CardDialog.vue';

const $q = useQuasar();
const boardStore = useBoardStore();

const cardDialogVisible = ref(false);
const cardDialogMode = ref<'create' | 'edit'>('create');
const editingCard = ref<Card | null>(null);
const activeColumnId = ref('');

function onAddCard(columnId: string): void {
  activeColumnId.value = columnId;
  editingCard.value = null;
  cardDialogMode.value = 'create';
  cardDialogVisible.value = true;
}

function onEditCard(columnId: string, card: Card): void {
  activeColumnId.value = columnId;
  editingCard.value = { ...card };
  cardDialogMode.value = 'edit';
  cardDialogVisible.value = true;
}

function onSaveCard(data: { title: string; description: string }): void {
  if (cardDialogMode.value === 'create') {
    boardStore.addCard(activeColumnId.value, data.title, data.description);
  } else if (editingCard.value) {
    boardStore.updateCard(activeColumnId.value, editingCard.value.id, data);
  }
  cardDialogVisible.value = false;
}

function onDeleteCard(columnId: string, cardId: string): void {
  $q.dialog({
    title: 'Удалить карточку',
    message: 'Вы уверены, что хотите удалить эту карточку?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    boardStore.removeCard(columnId, cardId);
  });
}

function onAddColumn(): void {
  $q.dialog({
    title: 'Новая колонка',
    message: 'Введите название:',
    prompt: {
      model: '',
      type: 'text',
      isValid: (val: string) => val.trim().length > 0,
    },
    cancel: true,
  }).onOk((title: string) => {
    boardStore.addColumn(title.trim());
  });
}

function onUpdateColumnTitle(columnId: string, title: string): void {
  boardStore.updateColumnTitle(columnId, title);
}

function onDeleteColumn(columnId: string): void {
  const column = boardStore.findColumn(columnId);
  const n = column?.cards.length ?? 0;
  const message =
    n > 0 ? `В колонке ${n} карточ${n === 1 ? 'ка' : n < 5 ? 'ки' : 'ек'}. Удалить?` : 'Удалить пустую колонку?';

  $q.dialog({
    title: 'Удалить колонку',
    message,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    boardStore.removeColumn(columnId);
  });
}

function onCardsUpdated(columnId: string, cards: Card[]): void {
  boardStore.updateColumnCards(columnId, cards);
}
</script>

<style lang="scss" scoped>
.board-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.board-scroll-container {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  padding: 24px;
}

.board-columns {
  display: inline-flex;
  gap: 16px;
  align-items: flex-start;
  height: 100%;
}

.add-column-btn {
  margin-top: 4px;
  opacity: 0.4;
  transition: opacity 0.2s;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
  }
}
</style>

<style lang="scss">
.board-scroll-container {
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 4px;

    .body--dark & {
      background: rgba(255, 255, 255, 0.15);
    }
  }
}
</style>
