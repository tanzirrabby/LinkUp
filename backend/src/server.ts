import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { env } from './config/env';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: env.clientOrigin }
});

io.on('connection', (socket) => {
  socket.on('join:user', (userId: string) => {
    socket.join(`user:${userId}`);
  });
});

httpServer.listen(env.port, () => {
  console.log(`API listening on :${env.port}`);
});
