import { Router } from 'express';
import { prisma } from '../../config/db';
import { requireAuth } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(notifications);
});

router.patch('/:id/read', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user!.userId },
    data: { isRead: true }
  });
  res.json({ updated: result.count });
});

router.patch('/read-all', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await prisma.notification.updateMany({
    where: { userId: req.user!.userId, isRead: false },
    data: { isRead: true }
  });
  res.json({ updated: result.count });
});

export default router;
