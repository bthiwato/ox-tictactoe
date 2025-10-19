import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { bestMove, winnerOf } from './bot';
import type { Board } from './types';

const prisma = new PrismaClient();
const router = Router();

function ensureAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// Helpers for difficulty
function randomMove(b: string[]) {
  const empty = b.map((v,i)=>v===' '?i:-1).filter(i=>i!==-1);
  return empty.length ? empty[Math.floor(Math.random()*empty.length)] : -1;
}
function getBotMove(board: string[], difficulty: 'easy'|'hard') {
  return difficulty === 'easy' ? randomMove(board) : bestMove(board as any);
}

router.post('/new', ensureAuth, async (req, res) => {
  const { starter = 'X', difficulty = 'hard' } = (req.body || {}) as { starter?: 'X'|'O', difficulty?: 'easy'|'hard' };
  const board: string[] = Array(9).fill(' ');

  // If bot starts (O), make the first move according to difficulty
  if (starter === 'O') {
    const move = getBotMove(board, difficulty);
    if (move >= 0) board[move] = 'O';
  }

  res.json({ board });
});

router.post('/move', ensureAuth, async (req: any, res) => {
  const { board, index, difficulty = 'hard' } = req.body as { board: string[], index: number, difficulty?: 'easy'|'hard' };
  if (!Array.isArray(board) || typeof index !== 'number') {
    return res.status(400).json({ error: 'Bad request' });
  }
  if (board[index] !== ' ') {
    return res.status(400).json({ error: 'Cell not empty' });
  }

  // player X move
  board[index] = 'X';
  let w = winnerOf(board as any);
  if (w) return res.json({ board, winner: w });

  // bot O move according to difficulty
  const move = getBotMove(board, difficulty);
  if (move >= 0) board[move] = 'O';
  w = winnerOf(board as any);
  return res.json({ board, winner: w || null });
});

router.post('/finish', ensureAuth, async (req: any, res) => {
  const userId = req.user.id as string;
  const { board, winner } = req.body as { board: string[], winner: 'X' | 'O' | 'DRAW' };

  await prisma.match.create({
    data: { userId, board: board.join(''), result: winner }
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  let score = user.score;
  let winStreak = user.winStreak;

  if (winner === 'X') {
    score += 1;
    winStreak += 1;
    if (winStreak === 3) {
      score += 1; // bonus
      winStreak = 0;
    }
  } else if (winner === 'O') {
    score -= 1;
    winStreak = 0;
  } else {
    // draw: no change
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { score, winStreak }
  });

  res.json({ score: updated.score, winStreak: updated.winStreak });
});

export default router;