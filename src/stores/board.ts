import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { Board, Card, Column } from 'src/types/board';
import { createCard, createColumn, createDefaultBoard } from 'src/utils/board-factory';

export const useBoardStore = defineStore('board', () => {
  const board = useStorage<Board>('kanban-board', createDefaultBoard(), localStorage, {
    mergeDefaults: true,
  });

  function addColumn(title = 'Новая колонка'): void {
    board.value.columns.push(createColumn(title));
    touch();
  }

  function updateColumnTitle(columnId: string, title: string): void {
    const column = findColumn(columnId);
    if (column) {
      column.title = title;
      touch();
    }
  }

  function moveCard(fromColumnId: string, cardId: string, toColumnId: string): void {
    if (fromColumnId === toColumnId) return;

    const fromColumn = findColumn(fromColumnId);
    const toColumn = findColumn(toColumnId);
    if (!fromColumn || !toColumn) return;

    const cardIndex = fromColumn.cards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return;

    const removed = fromColumn.cards.splice(cardIndex, 1);
    const card = removed[0];
    if (!card) return;

    card.updatedAt = Date.now();
    toColumn.cards.push(card);
    touch();
  }

  function removeColumn(columnId: string): void {
    const index = board.value.columns.findIndex((c) => c.id === columnId);
    if (index !== -1) {
      board.value.columns.splice(index, 1);
      touch();
    }
  }

  function reorderColumns(newColumns: Column[]): void {
    board.value.columns = newColumns;
    touch();
  }

  function addCard(columnId: string, title: string, description = ''): void {
    const column = findColumn(columnId);
    if (column) {
      column.cards.push(createCard(title, description));
      touch();
    }
  }

  function updateCard(columnId: string, cardId: string, updates: { title?: string; description?: string }): void {
    const card = findCard(columnId, cardId);
    if (card) {
      if (updates.title !== undefined) card.title = updates.title;
      if (updates.description !== undefined) card.description = updates.description;
      card.updatedAt = Date.now();
      touch();
    }
  }

  function removeCard(columnId: string, cardId: string): void {
    const column = findColumn(columnId);
    if (!column) return;

    const index = column.cards.findIndex((c) => c.id === cardId);
    if (index !== -1) {
      column.cards.splice(index, 1);
      touch();
    }
  }

  function updateColumnCards(columnId: string, cards: Card[]): void {
    const column = findColumn(columnId);
    if (column) {
      column.cards = cards;
      touch();
    }
  }

  function resetBoard(): void {
    board.value = createDefaultBoard();
  }

  function findColumn(columnId: string): Column | undefined {
    return board.value.columns.find((c) => c.id === columnId);
  }

  function findCard(columnId: string, cardId: string): Card | undefined {
    return findColumn(columnId)?.cards.find((c) => c.id === cardId);
  }

  function touch(): void {
    board.value.updatedAt = Date.now();
  }

  return {
    board,

    addColumn,
    updateColumnTitle,
    moveCard,
    removeColumn,
    reorderColumns,

    addCard,
    updateCard,
    removeCard,
    updateColumnCards,

    resetBoard,
    findColumn,
    findCard,
  };
});
