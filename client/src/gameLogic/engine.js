/**
 * Game Engine - Pure functions only. No DOM, no side effects.
 * Used by: Solo, Local Multiplayer, and to mirror online state.
 */
import { GAME_CONFIG, GREEK_SYMBOLS } from './config.js';

export function createDeck(pairs = GAME_CONFIG.totalPairs) {
  const symbols = GREEK_SYMBOLS.slice(0, pairs);
  const doubled = [...symbols, ...symbols];
  return doubled
    .map((symbol, i) => ({ id: `card-${i}`, symbol, matched: false }))
    .sort(() => Math.random() - 0.5);
}

export function getInitialScores(playerCount = 1) {
  return Array.from({ length: playerCount }, () => GAME_CONFIG.startingScore);
}

/**
 * Process a flip in solo or local mode. Returns new state.
 */
export function processFlip(deck, flippedIndices, cardIndex, currentPlayerIndex, scores) {
  const nextDeck = deck.map((c, i) => (i === cardIndex ? { ...c } : c));
  const nextFlipped = [...flippedIndices, cardIndex];

  if (nextFlipped.length < 2) {
    return {
      deck: nextDeck,
      flippedIndices: nextFlipped,
      currentPlayerIndex,
      scores,
      match: null,
      flipBack: [],
      gameOver: false,
    };
  }

  const [a, b] = nextFlipped;
  const cardA = nextDeck[a];
  const cardB = nextDeck[b];
  const match = cardA.symbol === cardB.symbol;

  if (match) {
    nextDeck[a] = { ...cardA, matched: true };
    nextDeck[b] = { ...cardB, matched: true };
    const allMatched = nextDeck.every((c) => c.matched);
    return {
      deck: nextDeck,
      flippedIndices: [],
      currentPlayerIndex,
      scores,
      match: true,
      flipBack: [],
      gameOver: allMatched,
    };
  }

  const newScores = [...scores];
  newScores[currentPlayerIndex] = Math.max(0, newScores[currentPlayerIndex] - GAME_CONFIG.penalty);
  const nextPlayer = (currentPlayerIndex + 1) % scores.length;
  const gameOver = newScores[currentPlayerIndex] === 0 || nextDeck.every((c) => c.matched);

  return {
    deck: nextDeck,
    flippedIndices: [],
    currentPlayerIndex: nextPlayer,
    scores: newScores,
    match: false,
    flipBack: [a, b],
    gameOver,
  };
}

export function isGameOver(deck, scores) {
  const allMatched = deck.every((c) => c.matched);
  const anyZero = scores.some((s) => s <= 0);
  return allMatched || anyZero;
}

export { GAME_CONFIG };
