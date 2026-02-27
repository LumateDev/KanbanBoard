<template>
  <q-page class="mobile-board">
    <!-- Нет колонок -->
    <div v-if="columns.length === 0" class="empty-state">
      <q-icon name="view_column" size="64px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">Создайте первую колонку</div>
      <q-btn color="primary" icon="add" label="Добавить колонку" class="q-mt-lg" @click="onAddColumn" />
    </div>

    <!-- Есть колонки -->
    <template v-else>
      <!-- Header -->
      <div class="board-header">
        <template v-if="isAddColumnPage">
          <div class="header-title header-title--empty">
            <q-icon name="add_circle" size="24px" color="primary" class="q-mr-sm" />
            <span class="text-subtitle1 text-weight-bold">Новая колонка</span>
          </div>
        </template>
        <template v-else-if="currentColumn">
          <div
            class="header-title"
            @pointerdown="onTitlePointerDown"
            @pointerup="onTitlePointerUp"
            @pointercancel="onTitlePointerUp"
            @contextmenu.prevent
          >
            <span class="text-subtitle1 text-weight-bold ellipsis">
              {{ currentColumn.title }}
            </span>
            <q-badge color="grey-6" :label="currentColumn.cards.length" class="q-ml-sm" />
          </div>
          <q-btn flat round dense icon="delete" color="negative" @click="onDeleteColumn(currentColumn.id)">
            <q-tooltip>Удалить колонку</q-tooltip>
          </q-btn>
        </template>
      </div>

      <!-- Content — свайп-зона -->
      <div class="board-content" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
        <div class="swipe-track" :style="trackStyle">
          <div v-for="col in columns" :key="col.id" class="swipe-page">
            <!-- Пусто -->
            <div v-if="col.cards.length === 0" class="empty-column">
              <q-icon name="inbox" size="48px" color="grey-4" />
              <div class="text-grey-5 q-mt-sm">Нет карточек</div>
            </div>

            <!-- Карточки -->
            <div v-else class="cards-scroll">
              <MobileKanbanCard
                v-for="card in col.cards"
                :key="card.id"
                :card="card"
                :column-id="col.id"
                :columns="columns"
              />
            </div>
          </div>

          <!-- Последняя страница — добавить колонку -->
          <div class="swipe-page">
            <AddColumnPage @add="onAddColumn" />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="board-footer">
        <div class="footer-content">
          <div v-if="totalPages <= 7" class="nav-dots">
            <span
              v-for="i in totalPages"
              :key="i"
              class="dot"
              :class="{ active: i - 1 === currentIndex }"
              @click="currentIndex = i - 1"
            />
          </div>
          <div v-else class="nav-counter">
            <span class="text-caption text-grey-6">{{ currentIndex + 1 }} / {{ totalPages }}</span>
          </div>

          <q-btn
            v-if="!isAddColumnPage && currentColumn"
            round
            icon="add"
            color="primary"
            class="btn-add"
            @click="onAddCard(currentColumn.id)"
          />
        </div>
      </div>
    </template>

    <!-- Диалог редактирования заголовка -->
    <q-dialog v-model="editTitleVisible" persistent>
      <q-card class="edit-dialog">
        <q-card-section>
          <div class="text-h6">Название колонки</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="editTitleValue" dense outlined autofocus @keyup.enter="saveTitle" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="grey-7" @click="editTitleVisible = false" />
          <q-btn flat label="Сохранить" color="primary" :disable="!editTitleValue.trim()" @click="saveTitle" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useBoardStore } from 'stores/board';
import { useAppDialog } from 'src/composables/useAppDialog';
import type { Column } from 'src/types/board';
import MobileKanbanCard from './MobileKanbanCard.vue';
import AddColumnPage from './AddColumnPage.vue';

const props = defineProps<{
  columns: Column[];
}>();

const boardStore = useBoardStore();
const { promptText, confirm } = useAppDialog();

const currentIndex = ref(0);
const currentColumn = computed(() => props.columns[currentIndex.value] ?? null);
const totalPages = computed(() => props.columns.length + 1);
const isAddColumnPage = computed(() => currentIndex.value >= props.columns.length);

watch(
  () => props.columns.length,
  (len) => {
    if (currentIndex.value > len) {
      currentIndex.value = len;
    }
  }
);

async function onAddColumn(): Promise<void> {
  const title = await promptText({
    title: 'Новая колонка',
    message: 'Введите название:',
  });
  if (title) {
    boardStore.addColumn(title);
    currentIndex.value = props.columns.length - 1;
  }
}

async function onDeleteColumn(columnId: string): Promise<void> {
  const column = boardStore.findColumn(columnId);
  if (!column) return;
  const n = column.cards.length;
  const message =
    n > 0 ? `В колонке ${n} карточ${n === 1 ? 'ка' : n < 5 ? 'ки' : 'ек'}. Удалить?` : 'Удалить пустую колонку?';
  const ok = await confirm({ title: 'Удалить колонку', message });
  if (ok) boardStore.removeColumn(columnId);
}

async function onAddCard(columnId: string): Promise<void> {
  const title = await promptText({
    title: 'Новая карточка',
    message: 'Введите заголовок:',
  });
  if (title) boardStore.addCard(columnId, title);
}

const editTitleVisible = ref(false);
const editTitleValue = ref('');
let titlePressTimer: ReturnType<typeof setTimeout> | null = null;

function onTitlePointerDown(): void {
  titlePressTimer = setTimeout(() => {
    if (currentColumn.value) {
      editTitleValue.value = currentColumn.value.title;
      editTitleVisible.value = true;
    }
  }, 600);
}

function onTitlePointerUp(): void {
  if (titlePressTimer) {
    clearTimeout(titlePressTimer);
    titlePressTimer = null;
  }
}

function saveTitle(): void {
  const trimmed = editTitleValue.value.trim();
  if (trimmed && currentColumn.value && trimmed !== currentColumn.value.title) {
    boardStore.updateColumnTitle(currentColumn.value.id, trimmed);
  }
  editTitleVisible.value = false;
}

const touchStartX = ref(0);
const touchStartY = ref(0);
const deltaX = ref(0);
const deltaY = ref(0);

const SWIPE_THRESHOLD = 70;

function onTouchStart(e: TouchEvent): void {
  const t = e.touches[0];
  if (!t) return;
  touchStartX.value = t.clientX;
  touchStartY.value = t.clientY;
}

function onTouchMove(e: TouchEvent): void {
  const t = e.touches[0];
  if (!t) return;
  deltaX.value = t.clientX - touchStartX.value;
  deltaY.value = t.clientY - touchStartY.value;
}

function onTouchEnd(): void {
  if (Math.abs(deltaY.value) > Math.abs(deltaX.value)) {
    resetSwipe();
    return;
  }
  if (deltaX.value > SWIPE_THRESHOLD && currentIndex.value > 0) {
    currentIndex.value--;
  }
  if (deltaX.value < -SWIPE_THRESHOLD && currentIndex.value < totalPages.value - 1) {
    currentIndex.value++;
  }
  resetSwipe();
}

function resetSwipe() {
  deltaX.value = 0;
  deltaY.value = 0;
}

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: 'transform 0.3s ease',
}));
</script>

<style lang="scss" scoped>
.mobile-board {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 0;
}
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.board-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  border-radius: 8px;
  user-select: none;
  touch-action: none;
  transition: background 0.2s;

  &:active {
    background: var(--color-hover);
  }

  &--empty {
    cursor: default;
    &:active {
      background: transparent;
    }
  }
}

.board-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.swipe-track {
  display: flex;
  height: 100%;
}

.swipe-page {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.empty-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.cards-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 16px 16px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.board-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 8px;
  background: var(--color-bg-primary);
  border-top: 1px solid var(--color-border);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  position: relative;
}

.nav-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: calc(100% - 56px);
}

.nav-counter {
  width: calc(100% - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add {
  position: absolute;
  right: 0;
  margin-right: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-muted);
  opacity: 0.3;
  transition: all 0.3s;
  cursor: pointer;

  &.active {
    opacity: 1;
    background: $primary;
    transform: scale(1.3);
  }
}

.edit-dialog {
  min-width: 300px;
  max-width: 90vw;
}
</style>
