export type Cell = 'X' | 'O' | ' ';
export type Board = Cell[]; // length 9
export type Player = 'X' | 'O';

export function emptyBoard(): Board {
  return Array(9).fill(' ');
}