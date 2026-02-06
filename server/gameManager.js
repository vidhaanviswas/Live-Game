/**
 * Game Manager - In-memory game rooms for online multiplayer.
 * Handles: create room, join room, sync state, broadcast moves, disconnect, cleanup.
 */

const GAME_CONFIG = {
  startingScore: 100,
  penalty: 4,
  totalPairs: 8,
  flipDelay: 800,
};

const GREEK_SYMBOLS = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π'];

function createDeck(pairs = GAME_CONFIG.totalPairs) {
  const symbols = GREEK_SYMBOLS.slice(0, pairs);
  const doubled = [...symbols, ...symbols];
  return doubled
    .map((symbol, i) => ({ id: `card-${i}`, symbol, matched: false }))
    .sort(() => Math.random() - 0.5);
}

const rooms = new Map();
const waitingQueue = [];

export function createRoom(roomId, hostId, hostName = 'Host') {
  const deck = createDeck();
  const room = {
    id: roomId,
    hostId,
    players: [{ id: hostId, name: hostName, score: GAME_CONFIG.startingScore, isHost: true }],
    deck,
    flippedIndices: [],
    currentTurnPlayerIndex: 0,
    status: 'waiting', // waiting | playing | finished
    createdAt: Date.now(),
  };
  rooms.set(roomId, room);
  return room;
}

export function joinRoom(roomId, playerId, playerName = 'Guest') {
  const room = rooms.get(roomId);
  if (!room) return { error: 'Room not found' };
  if (room.players.length >= 2) return { error: 'Room full' };
  if (room.status !== 'waiting') return { error: 'Game already started' };

  room.players.push({ id: playerId, name: playerName, score: GAME_CONFIG.startingScore, isHost: false });
  room.status = 'playing';
  room.deck = createDeck(); // Fresh deck when second player joins
  return { room };
}

export function joinRandomMatch(playerId, playerName = 'Guest') {
  if (waitingQueue.length > 0) {
    const waiting = waitingQueue.shift();
    const room = joinRoom(waiting.roomId, playerId, playerName);
    if (room.error) {
      waitingQueue.unshift(waiting);
      return room;
    }
    return { room: room.room, matchedWith: waiting.playerId };
  }
  const roomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  createRoom(roomId, playerId, playerName);
  waitingQueue.push({ roomId, playerId });
  const room = rooms.get(roomId);
  return { room, waiting: true };
}

export function getRoom(roomId) {
  return rooms.get(roomId);
}

export function getPlayerIndex(room, playerId) {
  return room.players.findIndex((p) => p.id === playerId);
}

export function isCurrentTurn(room, playerId) {
  if (!room || room.players.length < 2) return false;
  const idx = getPlayerIndex(room, playerId);
  return idx === room.currentTurnPlayerIndex;
}

export function applyFlip(roomId, playerId, cardIndex) {
  const room = rooms.get(roomId);
  if (!room || room.status !== 'playing') return { error: 'Invalid room or game not active' };
  if (!isCurrentTurn(room, playerId)) return { error: 'Not your turn' };

  const deck = [...room.deck];
  if (deck[cardIndex].matched) return { error: 'Card already matched' };
  if (room.flippedIndices.includes(cardIndex)) return { error: 'Card already flipped' };

  const flippedIndices = [...room.flippedIndices, cardIndex];

  if (flippedIndices.length === 2) {
    const [a, b] = flippedIndices;
    const cardA = deck[a];
    const cardB = deck[b];
    const match = cardA.symbol === cardB.symbol;

    if (match) {
      deck[a] = { ...cardA, matched: true };
      deck[b] = { ...cardB, matched: true };
      room.deck = deck;
      room.flippedIndices = [];
      const allMatched = deck.every((c) => c.matched);
      if (allMatched) {
        room.status = 'finished';
      }
      return { room: { ...room }, match: true, flipBack: [], gameOver: room.status === 'finished' };
    } else {
      const currentIdx = room.currentTurnPlayerIndex;
      const newScore = Math.max(0, room.players[currentIdx].score - GAME_CONFIG.penalty);
      room.players[currentIdx].score = newScore;
      room.flippedIndices = [];
      room.deck = deck;
      const gameOver = newScore === 0 || room.deck.every((c) => c.matched);
      if (gameOver) room.status = 'finished';
      room.currentTurnPlayerIndex = (room.currentTurnPlayerIndex + 1) % room.players.length;
      return {
        room: { ...room },
        match: false,
        flipBack: [a, b],
        gameOver,
      };
    }
  }

  room.flippedIndices = flippedIndices;
  room.deck = deck;
  return { room: { ...room }, match: null, flipBack: [] };
}

export function removeFromWaitingQueue(roomId, playerId) {
  const idx = waitingQueue.findIndex((w) => w.roomId === roomId && w.playerId === playerId);
  if (idx !== -1) waitingQueue.splice(idx, 1);
}

export function leaveRoom(roomId, playerId) {
  const room = rooms.get(roomId);
  if (!room) return null;
  removeFromWaitingQueue(roomId, playerId);
  room.status = 'finished';
  room.winnerByDisconnect = room.players.find((p) => p.id !== playerId)?.id;
  return room;
}

export function deleteRoom(roomId) {
  rooms.delete(roomId);
  const idx = waitingQueue.findIndex((w) => w.roomId === roomId);
  if (idx !== -1) waitingQueue.splice(idx, 1);
}

export { GAME_CONFIG, GREEK_SYMBOLS };
