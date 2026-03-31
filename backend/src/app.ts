import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import friendshipRoutes from './modules/friendships/friendships.routes';
import postRoutes from './modules/posts/posts.routes';
import commentRoutes from './modules/comments/comments.routes';
import reactionRoutes from './modules/reactions/reactions.routes';
import shareRoutes from './modules/shares/shares.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import searchRoutes from './modules/search/search.routes';
import mediaRoutes from './modules/media/media.routes';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/friendships', friendshipRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', reactionRoutes);
app.use('/api/v1', shareRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/media', mediaRoutes);

app.use(errorHandler);
