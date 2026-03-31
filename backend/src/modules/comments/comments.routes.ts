import { Router } from 'express';
import { prisma } from '../../config/db';
import { requireAuth } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';

const router = Router();

router.post('/posts/:postId/comments', requireAuth, async (req: AuthenticatedRequest, res) => {
  const comment = await prisma.comment.create({
    data: {
      postId: req.params.postId,
      authorId: req.user!.userId,
      content: req.body.content
    }
  });
  res.status(201).json(comment);
});

router.get('/posts/:postId/comments', async (req, res) => {
  const comments = await prisma.comment.findMany({ where: { postId: req.params.postId }, orderBy: { createdAt: 'asc' } });
  res.json(comments);
});

router.patch('/comments/:commentId', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await prisma.comment.updateMany({
    where: { id: req.params.commentId, authorId: req.user!.userId },
    data: { content: req.body.content }
  });
  res.json({ updated: result.count });
});

router.delete('/comments/:commentId', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await prisma.comment.deleteMany({ where: { id: req.params.commentId, authorId: req.user!.userId } });
  res.json({ deleted: result.count });
});

export default router;
