import { Router } from 'express';
import { prisma } from '../../config/db';

const router = Router();

router.get('/users', async (req, res) => {
  const q = String(req.query.q ?? '');
  const users = await prisma.user.findMany({
    where: {
      OR: [{ username: { contains: q, mode: 'insensitive' } }, { displayName: { contains: q, mode: 'insensitive' } }]
    },
    take: 20
  });
  res.json(users);
});

router.get('/posts', async (req, res) => {
  const q = String(req.query.q ?? '');
  const posts = await prisma.post.findMany({
    where: { contentText: { contains: q, mode: 'insensitive' }, visibility: 'public' },
    take: 20,
    orderBy: { createdAt: 'desc' }
  });
  res.json(posts);
});

router.get('/all', async (req, res) => {
  const q = String(req.query.q ?? '');
  const [users, posts] = await Promise.all([
    prisma.user.findMany({ where: { username: { contains: q, mode: 'insensitive' } }, take: 10 }),
    prisma.post.findMany({ where: { contentText: { contains: q, mode: 'insensitive' }, visibility: 'public' }, take: 10 })
  ]);
  res.json({ users, posts });
});

export default router;
