import { Router } from 'express';
import { prisma } from '../../config/db';
import { requireAuth } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';

const router = Router();

router.post('/posts/:postId/shares', requireAuth, async (req: AuthenticatedRequest, res) => {
  const share = await prisma.share.create({
    data: {
      postId: req.params.postId,
      authorId: req.user!.userId,
      shareText: req.body.shareText
    }
  });
  res.status(201).json(share);
});

export default router;
