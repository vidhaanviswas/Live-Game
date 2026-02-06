import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import Board from '../components/Board';
import ScorePanel from '../components/ScorePanel';
import TurnIndicator from '../components/TurnIndicator';
import EndGameModal from '../components/EndGameModal';

export default function Local() {
  const {
    mode,
    deck,
    flippedIndices,
    scores,
    currentPlayerIndex,
    playerNames,
    gameOver,
    winnerIndex,
    initLocal,
    flipCard,
    reset,
  } = useGameStore();

  useEffect(() => {
    if (mode !== 'local') initLocal();
  }, [mode, initLocal]);

  if (!deck.length) return null;

  const canFlip = !gameOver && flippedIndices.length < 2;
  const winnerName = winnerIndex != null ? playerNames[winnerIndex] : null;
  const message = gameOver
    ? (winnerName ? `${winnerName} wins!` : scores.every((s) => s <= 0) ? "It's a tie — both at 0!" : 'All pairs matched!')
    : '';

  return (
    <div className="min-h-screen p-4 sm:p-6 font-display">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="text-slate-400 hover:text-white text-sm">← Home</Link>
        </div>
        <h2 className="text-xl font-semibold text-center text-slate-200 mb-2">Local Multiplayer</h2>
        <TurnIndicator currentPlayerIndex={currentPlayerIndex} playerNames={playerNames} />
        <ScorePanel
          playerNames={playerNames}
          scores={scores}
          currentPlayerIndex={currentPlayerIndex}
          mode="local"
        />
        <Board
          deck={deck}
          flippedIndices={flippedIndices}
          canFlip={canFlip}
          onFlip={flipCard}
        />
        <EndGameModal
          open={gameOver}
          title="Game Over"
          message={message}
          winnerName={winnerName}
          scores={scores}
          onClose={reset}
          onPlayAgain={() => { reset(); initLocal(); }}
        />
      </div>
    </div>
  );
}
