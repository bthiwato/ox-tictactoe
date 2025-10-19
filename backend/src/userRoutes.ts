import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

function ensureAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

router.get('/me', ensureAuth, async (req: any, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json({ id: u.id, name: u.displayName, email: u.email, photoUrl: u.photoUrl, score: u.score, winStreak: u.winStreak });
});

router.get('/leaderboard', ensureAuth, async (_req, res) => {
  const top = await prisma.user.findMany({
    orderBy: [ { score: 'desc' }, { createdAt: 'asc' } ],
    select: { id: true, displayName: true, photoUrl: true, score: true }
  });
  res.json(top);
});

export default router;