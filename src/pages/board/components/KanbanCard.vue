<template>
  <q-card class="kanban-card" bordered flat>
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

        <q-btn flat round dense size="sm" icon="close" color="grey-5" class="delete-btn" @click.stop="onDelete">
          <q-tooltip>Удалить</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useBoardStore } from 'stores/board';
import { useAppDialog } from 'src/composables/useAppDialog';
import type { Card } from 'src/types/board';

const props = defineProps<{
  card: Card;
  columnId: string;
}>();

const boardStore = useBoardStore();
const { confirm } = useAppDialog();

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
.kanban-card {
  border-radius: 8px;
  transition: all 0.2s ease;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  cursor: grab;

  .body--dark & {
    background: #2d2d2d;
    border-color: rgba(255, 255, 255, 0.08);
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    border-color: var(--color-text-muted);

    .delete-btn {
      opacity: 1;
    }
  }

  &:active {
    cursor: grabbing;
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
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}
</style>
