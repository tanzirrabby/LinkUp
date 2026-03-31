import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signAccessToken = (userId: string) =>
  jwt.sign({ userId }, env.accessSecret, { expiresIn: '15m' });

export const signRefreshToken = (userId: string) =>
  jwt.sign({ userId }, env.refreshSecret, { expiresIn: '30d' });
