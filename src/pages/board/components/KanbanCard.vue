<template>
  <q-card class="kanban-card cursor-pointer" bordered flat @click="$emit('click')">
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

        <q-btn flat round dense size="xs" icon="close" color="grey-5" class="delete-btn" @click.stop="$emit('delete')">
          <q-tooltip>Удалить</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Card } from 'src/types/board';

defineProps<{
  card: Card;
}>();

defineEmits<{
  click: [];
  delete: [];
}>();
</script>

<style lang="scss" scoped>
.kanban-card {
  border-radius: 8px;
  transition:
    box-shadow 0.2s,
    transform 0.15s;
  background: white;

  .body--dark & {
    background: #3a3a3a;
    border-color: rgba(255, 255, 255, 0.08);
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);

    .delete-btn {
      opacity: 1;
    }
  }
}

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 4px;
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

@media (max-width: 599px) {
  .delete-btn {
    opacity: 0.6;
  }
}
</style>
