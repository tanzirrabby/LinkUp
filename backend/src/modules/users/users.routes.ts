import { Router } from 'express';
import { prisma } from '../../config/db';
import { requireAuth } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';

const router = Router();

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  res.json(user);
});

router.patch('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: req.body
  });
  res.json(user);
});

router.patch('/me/avatar', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { avatarUrl: req.body.avatarUrl }
  });
  res.json(user);
});

router.patch('/me/cover', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { coverUrl: req.body.coverUrl }
  });
  res.json(user);
});

router.get('/me/privacy-settings', requireAuth, async (_req: AuthenticatedRequest, res) => {
  res.json({ defaultPostVisibility: 'friends', profileVisibility: 'public', allowFriendRequests: true });
});

router.patch('/me/privacy-settings', requireAuth, async (req: AuthenticatedRequest, res) => {
  res.json({ ...req.body, updated: true });
});

router.get('/:userId', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
});

export default router;
