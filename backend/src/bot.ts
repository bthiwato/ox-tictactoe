import type { Board, Player, Cell } from './types';

function winnerOf(board: Board): Player | 'DRAW' | null {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  if (board.every(c => c !== ' ')) return 'DRAW';
  return null;
}

function minimax(board: Board, isMaximizing: boolean): number {
  const w = winnerOf(board);
  if (w === 'X') return -1;
  if (w === 'O') return 1;
  if (w === 'DRAW') return 0;

  const mark: Cell = isMaximizing ? 'O' : 'X';
  const scores: number[] = [];

  for (let i = 0; i < 9; i++) {
    if (board[i] === ' ') {
      board[i] = mark;
      const score = minimax(board, !isMaximizing);
      scores.push(score);
      board[i] = ' ';
    }
  }

  return isMaximizing ? Math.max(...scores) : Math.min(...scores);
}

export function bestMove(board: Board): number {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === ' ') {
      board[i] = 'O';
      const score = minimax(board, false);
      board[i] = ' ';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

export { winnerOf };