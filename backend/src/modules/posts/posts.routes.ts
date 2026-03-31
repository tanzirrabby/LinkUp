import { Router } from 'express';
import { prisma } from '../../config/db';
import { requireAuth } from '../../middleware/auth.middleware';
import { AuthenticatedRequest } from '../../common/types';

const router = Router();

router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const post = await prisma.post.create({
    data: {
      authorId: req.user!.userId,
      contentText: req.body.contentText,
      visibility: req.body.visibility ?? 'public'
    }
  });
  res.status(201).json(post);
});

router.get('/feed', requireAuth, async (req: AuthenticatedRequest, res) => {
  const friends = await prisma.friendship.findMany({ where: { userId: req.user!.userId } });
  const ids = [req.user!.userId, ...friends.map((f) => f.friendId)];
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { visibility: 'public' },
        { AND: [{ visibility: 'friends' }, { authorId: { in: ids } }] },
        { AND: [{ visibility: 'private' }, { authorId: req.user!.userId }] }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 30
  });
  res.json(posts);
});

router.get('/users/:userId/posts', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { authorId: req.params.userId, visibility: 'public' },
    orderBy: { createdAt: 'desc' },
    take: 30
  });
  res.json(posts);
});

router.get('/:postId', async (req, res) => {
  const post = await prisma.post.findUnique({ where: { id: req.params.postId }, include: { media: true } });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  return res.json(post);
});

router.patch('/:postId', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await prisma.post.updateMany({
    where: { id: req.params.postId, authorId: req.user!.userId },
    data: { contentText: req.body.contentText }
  });
  res.json({ updated: result.count });
});

router.patch('/:postId/privacy', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await prisma.post.updateMany({
    where: { id: req.params.postId, authorId: req.user!.userId },
    data: { visibility: req.body.visibility }
  });
  res.json({ updated: result.count });
});

router.delete('/:postId', requireAuth, async (req: AuthenticatedRequest, res) => {
  const result = await prisma.post.deleteMany({ where: { id: req.params.postId, authorId: req.user!.userId } });
  res.json({ deleted: result.count });
});

export default router;
