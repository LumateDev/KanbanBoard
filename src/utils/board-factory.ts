import type { Board, Column, Card } from 'src/types/board';
import { generateId } from './id';

export function createCard(title: string, description = ''): Card {
  const now = Date.now();
  return {
    id: generateId(),
    title,
    description,
    createdAt: now,
    updatedAt: now,
  };
}

export function createColumn(title: string, cards: Card[] = []): Column {
  return {
    id: generateId(),
    title,
    cards,
    createdAt: Date.now(),
  };
}

export function createDefaultBoard(): Board {
  const now = Date.now();
  return {
    id: generateId(),
    title: 'Моя доска',
    columns: [createColumn('Нужно сделать'), createColumn('В работе'), createColumn('Готово')],
    createdAt: now,
    updatedAt: now,
  };
}
