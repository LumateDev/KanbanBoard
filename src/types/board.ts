export interface Card {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
  createdAt: number;
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  createdAt: number;
  updatedAt: number;
}
