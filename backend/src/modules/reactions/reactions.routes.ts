import { Router } from 'express';
import { prisma } from '../../config/db';
import { requireAuth } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';

const router = Router();

router.post('/posts/:postId/reactions', requireAuth, async (req: AuthenticatedRequest, res) => {
  const reaction = await prisma.reaction.upsert({
    where: { postId_userId: { postId: req.params.postId, userId: req.user!.userId } },
    update: { reactionType: req.body.reactionType ?? 'like' },
    create: {
      postId: req.params.postId,
      userId: req.user!.userId,
      reactionType: req.body.reactionType ?? 'like'
    }
  });
  res.status(201).json(reaction);
});

router.delete('/posts/:postId/reactions', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await prisma.reaction.deleteMany({ where: { postId: req.params.postId, userId: req.user!.userId } });
  res.json({ deleted: result.count });
});

export default router;
