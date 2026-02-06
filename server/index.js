import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  createRoom,
  joinRoom,
  joinRandomMatch,
  getRoom,
  applyFlip,
  leaveRoom,
  deleteRoom,
  removeFromWaitingQueue,
  getPlayerIndex,
} from './gameManager.js';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  socket.on('create-room', (playerName, cb) => {
    const roomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    createRoom(roomId, socket.id, playerName || 'Host');
    socket.join(roomId);
    const room = getRoom(roomId);
    cb?.({ roomId, room, inviteLink: `${getInviteBaseUrl(socket)}/play?room=${roomId}` });
  });

  socket.on('join-room', (data, cb) => {
    const { roomId, playerName } = data || {};
    const result = joinRoom(roomId, socket.id, playerName || 'Guest');
    if (result.error) {
      cb?.({ error: result.error });
      return;
    }
    socket.join(roomId);
    io.to(roomId).emit('room-update', result.room);
    cb?.({ room: result.room });
  });

  socket.on('join-random', (playerName, cb) => {
    const result = joinRandomMatch(socket.id, playerName || 'Guest');
    if (result.error) {
      cb?.({ error: result.error });
      return;
    }
    socket.join(result.room.id);
    io.to(result.room.id).emit('room-update', result.room);
    if (result.matchedWith) {
      io.to(result.room.id).emit('game-started', result.room);
    }
    cb?.({ room: result.room, waiting: result.waiting });
  });

  socket.on('flip-card', (data, cb) => {
    const { roomId, cardIndex } = data || {};
    const result = applyFlip(roomId, socket.id, cardIndex);
    if (result.error) {
      cb?.({ error: result.error });
      return;
    }
    io.to(roomId).emit('game-state', {
      room: result.room,
      match: result.match,
      flipBack: result.flipBack,
      gameOver: result.gameOver,
    });
    cb?.({ room: result.room, match: result.match, flipBack: result.flipBack, gameOver: result.gameOver });
  });

  socket.on('disconnect', () => {
    const roomsJoined = Array.from(socket.rooms).filter((r) => r !== socket.id);
    roomsJoined.forEach((roomId) => {
      const room = leaveRoom(roomId, socket.id);
      if (room) {
        io.to(roomId).emit('player-left', { room, leftPlayerId: socket.id });
        setTimeout(() => deleteRoom(roomId), 60000);
      }
    });
  });
});

function getInviteBaseUrl(socket) {
  const origin = socket?.handshake?.headers?.origin;
  return process.env.FRONTEND_URL || origin || 'http://localhost:5173';
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Memory Game server on port ${PORT}`);
});
