import { Router } from 'express';
import { prisma } from '../../config/db';
import { requireAuth } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';

const router = Router();

router.post('/requests/:targetUserId', requireAuth, async (req: AuthenticatedRequest, res) => {
  const request = await prisma.friendRequest.create({
    data: {
      requesterId: req.user!.userId,
      receiverId: req.params.targetUserId
    }
  });
  res.status(201).json(request);
});

router.patch('/requests/:requestId/accept', requireAuth, async (req: AuthenticatedRequest, res) => {
  const fr = await prisma.friendRequest.update({
    where: { id: req.params.requestId },
    data: { status: 'accepted' }
  });

  await prisma.friendship.createMany({
    data: [
      { userId: fr.requesterId, friendId: fr.receiverId },
      { userId: fr.receiverId, friendId: fr.requesterId }
    ],
    skipDuplicates: true
  });

  res.json(fr);
});

router.patch('/requests/:requestId/reject', requireAuth, async (req, res) => {
  const fr = await prisma.friendRequest.update({
    where: { id: req.params.requestId },
    data: { status: 'rejected' }
  });
  res.json(fr);
});

router.get('/requests/incoming', requireAuth, async (req: AuthenticatedRequest, res) => {
  const rows = await prisma.friendRequest.findMany({
    where: { receiverId: req.user!.userId, status: 'pending' }
  });
  res.json(rows);
});

router.get('/requests/outgoing', requireAuth, async (req: AuthenticatedRequest, res) => {
  const rows = await prisma.friendRequest.findMany({
    where: { requesterId: req.user!.userId, status: 'pending' }
  });
  res.json(rows);
});

router.delete('/:friendUserId', requireAuth, async (req: AuthenticatedRequest, res) => {
  const a = await prisma.friendship.deleteMany({ where: { userId: req.user!.userId, friendId: req.params.friendUserId } });
  const b = await prisma.friendship.deleteMany({ where: { userId: req.params.friendUserId, friendId: req.user!.userId } });
  res.json({ deleted: a.count + b.count });
});

router.get('/:userId/friends', async (req, res) => {
  const friends = await prisma.friendship.findMany({ where: { userId: req.params.userId } });
  res.json(friends);
});

export default router;
