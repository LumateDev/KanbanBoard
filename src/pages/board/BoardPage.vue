<template>
  <MobileBoard
    v-if="isMobile"
    :columns="boardStore.board.columns"
    @add-card="onAddCard"
    @delete-card="onDeleteCard"
    @move-card="onMoveCard"
    @update-title="onUpdateColumnTitle"
    @delete-column="onDeleteColumn"
    @add-column="onAddColumn"
  />

  <DesktopBoard v-else />

  <CardDialog v-model="cardDialogVisible" @save="onSaveCard" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useBoardStore } from 'stores/board';
import { useAppDialog } from 'src/composables/useAppDialog';
import MobileBoard from './components/MobileBoard.vue';
import DesktopBoard from './components/DesktopBoard.vue';
import CardDialog from './components/CardDialog.vue';

const $q = useQuasar();
const boardStore = useBoardStore();
const { confirm, promptText } = useAppDialog();

const isMobile = computed(() => $q.screen.width < 600);

const cardDialogVisible = ref(false);
const activeColumnId = ref('');

function onAddCard(columnId: string): void {
  activeColumnId.value = columnId;
  cardDialogVisible.value = true;
}

function onSaveCard(data: { title: string; description: string }): void {
  boardStore.addCard(activeColumnId.value, data.title, data.description);
  cardDialogVisible.value = false;
}

async function onDeleteCard(columnId: string, cardId: string): Promise<void> {
  const ok = await confirm({
    title: 'Удалить карточку',
    message: 'Вы уверены, что хотите удалить эту карточку?',
  });
  if (ok) boardStore.removeCard(columnId, cardId);
}

function onMoveCard(fromColumnId: string, cardId: string, toColumnId: string): void {
  boardStore.moveCard(fromColumnId, cardId, toColumnId);
}

async function onAddColumn(): Promise<void> {
  const title = await promptText({
    title: 'Новая колонка',
    message: 'Введите название:',
  });
  if (title) boardStore.addColumn(title);
}

function onUpdateColumnTitle(columnId: string, title: string): void {
  boardStore.updateColumnTitle(columnId, title);
}

async function onDeleteColumn(columnId: string): Promise<void> {
  const column = boardStore.findColumn(columnId);
  const n = column?.cards.length ?? 0;
  const message =
    n > 0 ? `В колонке ${n} карточ${n === 1 ? 'ка' : n < 5 ? 'ки' : 'ек'}. Удалить?` : 'Удалить пустую колонку?';

  const ok = await confirm({ title: 'Удалить колонку', message });
  if (ok) boardStore.removeColumn(columnId);
}
</script>
