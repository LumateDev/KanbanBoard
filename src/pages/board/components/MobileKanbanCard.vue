<template>
  <q-card
    class="mobile-kanban-card"
    bordered
    flat
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @contextmenu.prevent
  >
    <q-card-section class="q-pa-sm">
      <div class="card-content">
        <div class="card-text">
          <div class="text-subtitle2 text-weight-medium ellipsis-2-lines">
            {{ card.title }}
          </div>
          <div v-if="card.description" class="text-caption text-grey-6 q-mt-xs ellipsis-2-lines">
            {{ card.description }}
          </div>
        </div>

        <q-btn flat round dense size="sm" icon="close" color="grey-5" class="delete-btn" @click.stop="onDelete" />
      </div>
    </q-card-section>

    <!-- Диалог перемещения -->
    <q-dialog v-model="moveDialogVisible" position="bottom">
      <q-card class="move-dialog">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">Переместить в...</div>
        </q-card-section>

        <q-list>
          <q-item v-for="col in availableColumns" :key="col.id" clickable v-close-popup @click="onMove(col.id)">
            <q-item-section avatar>
              <q-icon name="arrow_forward" />
            </q-item-section>
            <q-item-section>{{ col.title }}</q-item-section>
            <q-item-section side>
              <q-badge :label="col.cards.length" color="grey-5" />
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn flat label="Отмена" color="grey-7" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBoardStore } from 'stores/board';
import { useAppDialog } from 'src/composables/useAppDialog';
import type { Card, Column } from 'src/types/board';

const props = defineProps<{
  card: Card;
  columnId: string;
  columns: Column[];
}>();

const boardStore = useBoardStore();
const { confirm } = useAppDialog();

const moveDialogVisible = ref(false);
const availableColumns = computed(() => props.columns.filter((c) => c.id !== props.columnId));

// Долгое нажатие для перемещения
let pressTimer: ReturnType<typeof setTimeout> | null = null;

function onPointerDown(): void {
  pressTimer = setTimeout(() => {
    if (availableColumns.value.length > 0) {
      moveDialogVisible.value = true;
    }
  }, 500);
}

function onPointerUp(): void {
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
}

function onMove(toColumnId: string): void {
  boardStore.moveCard(props.columnId, props.card.id, toColumnId);
}

async function onDelete(): Promise<void> {
  const ok = await confirm({
    title: 'Удалить карточку',
    message: 'Вы уверены, что хотите удалить эту карточку?',
  });
  if (ok) {
    boardStore.removeCard(props.columnId, props.card.id);
  }
}
</script>

<style lang="scss" scoped>
.mobile-kanban-card {
  border-radius: 10px;
  background: var(--color-bg-elevated);
  transition: box-shadow 0.2s;
  user-select: none;

  /* ✅ ВАЖНО — разрешаем вертикальный скролл */
  touch-action: pan-y;

  &:active {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }

  .body--dark & {
    background: #3a3a3a;
    border-color: rgba(255, 255, 255, 0.08);
  }
}

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.card-text {
  flex: 1;
  min-width: 0;
}

.delete-btn {
  opacity: 0.5;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

.move-dialog {
  border-radius: 16px 16px 0 0;
}
</style>
