import { create } from 'zustand';
import { createDeck, getInitialScores, processFlip, GAME_CONFIG } from '../gameLogic/engine.js';

const { flipDelay } = GAME_CONFIG;

export const useGameStore = create((set, get) => ({
  mode: null, // 'solo' | 'local' | 'online'
  deck: [],
  flippedIndices: [],
  currentPlayerIndex: 0,
  scores: [],
  playerNames: ['Player 1', 'Player 2'],
  moves: 0,
  startTime: null,
  gameOver: false,
  winnerIndex: null,

  // Online-only
  roomId: null,
  room: null,
  myPlayerIndex: null,
  connected: false,

  initSolo: () =>
    set({
      mode: 'solo',
      deck: createDeck(),
      flippedIndices: [],
      currentPlayerIndex: 0,
      scores: [GAME_CONFIG.startingScore],
      playerNames: ['You'],
      moves: 0,
      startTime: Date.now(),
      gameOver: false,
      winnerIndex: null,
    }),

  initLocal: () =>
    set({
      mode: 'local',
      deck: createDeck(),
      flippedIndices: [],
      currentPlayerIndex: 0,
      scores: getInitialScores(2),
      playerNames: ['Player 1', 'Player 2'],
      moves: 0,
      startTime: Date.now(),
      gameOver: false,
      winnerIndex: null,
    }),

  initOnline: (room, myPlayerIndex) => {
    const deck = room.deck || [];
    const scores = room.players?.map((p) => p.score) || [];
    const names = room.players?.map((p) => p.name) || ['Guest 1', 'Guest 2'];
    set({
      mode: 'online',
      roomId: room.id,
      room,
      deck,
      flippedIndices: room.flippedIndices || [],
      currentPlayerIndex: room.currentTurnPlayerIndex ?? 0,
      scores,
      playerNames: names,
      myPlayerIndex,
      gameOver: room.status === 'finished',
      winnerIndex: null,
    });
  },

  syncFromRoom: (room) => {
    const state = get();
    if (state.mode !== 'online') return;
    const scores = room.players?.map((p) => p.score) ?? state.scores;
    const names = room.players?.map((p) => p.name) ?? state.playerNames;
    set({
      room,
      deck: room.deck ?? state.deck,
      flippedIndices: room.flippedIndices ?? [],
      currentPlayerIndex: room.currentTurnPlayerIndex ?? 0,
      scores,
      playerNames: names,
      gameOver: room.status === 'finished',
    });
  },

  flipCard: (cardIndex) => {
    const { mode, deck, flippedIndices, currentPlayerIndex, scores } = get();
    if (mode === 'online') return; // Online flips go through socket
    if (deck[cardIndex].matched) return;
    if (flippedIndices.includes(cardIndex)) return;
    if (flippedIndices.length >= 2) return;

    const result = processFlip(deck, flippedIndices, cardIndex, currentPlayerIndex, scores);
    let winnerIndex = null;
    if (result.gameOver && result.scores?.length) {
      const anyZero = result.scores.some((s) => s <= 0);
      if (anyZero) winnerIndex = result.scores.findIndex((s) => s > 0);
      else if (result.deck.every((c) => c.matched)) {
        const maxScore = Math.max(...result.scores);
        const idx = result.scores.indexOf(maxScore);
        winnerIndex = result.scores.filter((s) => s === maxScore).length === 1 ? idx : null; // tie if same score
      }
    }

    set({
      deck: result.deck,
      flippedIndices: result.flipBack?.length ? result.flipBack : result.flippedIndices,
      currentPlayerIndex: result.currentPlayerIndex,
      scores: result.scores,
      moves: get().moves + 1,
      gameOver: result.gameOver,
      winnerIndex: winnerIndex != null && winnerIndex !== -1 ? winnerIndex : null,
    });
    if (result.flipBack?.length) {
      setTimeout(() => get().mode === 'solo' || get().mode === 'local' ? set({ flippedIndices: [] }) : null, flipDelay);
    }
    return result;
  },

  setFlippedIndices: (indices) => set({ flippedIndices: indices }),

  setConnected: (connected) => set({ connected }),

  reset: () =>
    set({
      mode: null,
      deck: [],
      roomId: null,
      room: null,
      gameOver: false,
    }),
}));
