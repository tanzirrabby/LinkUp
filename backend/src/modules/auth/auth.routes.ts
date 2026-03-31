import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../config/db';
import { signAccessToken, signRefreshToken } from '../../common/jwt';
import { env } from '../../config/env';

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
  displayName: z.string().min(1)
});

router.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  const { email, username, password, displayName } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, username, passwordHash, displayName }
  });

  res.status(201).json({ id: user.id, email: user.email, username: user.username });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    accessToken: signAccessToken(user.id),
    refreshToken: signRefreshToken(user.id),
    user: { id: user.id, username: user.username, displayName: user.displayName }
  });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body as { refreshToken: string };
  try {
    const payload = jwt.verify(refreshToken, env.refreshSecret) as { userId: string };
    return res.json({ accessToken: signAccessToken(payload.userId) });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', (_req, res) => res.status(204).send());

export default router;
