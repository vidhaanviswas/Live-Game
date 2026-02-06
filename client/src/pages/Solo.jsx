import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import Board from '../components/Board';
import ScorePanel from '../components/ScorePanel';
import EndGameModal from '../components/EndGameModal';

export default function Solo() {
  const { mode, deck, flippedIndices, scores, moves, startTime, gameOver, winnerIndex, initSolo, flipCard, reset } = useGameStore();
  const [finalTime, setFinalTime] = useState(null);

  useEffect(() => {
    if (mode !== 'solo') initSolo();
  }, [mode, initSolo]);

  useEffect(() => {
    if (gameOver && startTime != null && finalTime === null)
      setFinalTime(Math.floor((Date.now() - startTime) / 1000));
  }, [gameOver, startTime, finalTime]);

  if (!deck.length) return null;

  const canFlip = !gameOver && flippedIndices.length < 2;
  const elapsedSeconds = gameOver && finalTime != null
    ? finalTime
    : startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 font-display">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="text-slate-400 hover:text-white text-sm">← Home</Link>
        </div>
        <h2 className="text-xl font-semibold text-center text-slate-200 mb-2">Solo</h2>
        <ScorePanel
          playerNames={['You']}
          scores={scores}
          currentPlayerIndex={0}
          moves={moves}
          elapsedSeconds={elapsedSeconds}
          mode="solo"
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
          message={scores[0] > 0 ? 'You matched all pairs!' : 'You ran out of points.'}
          scores={scores}
          moves={moves}
          elapsedSeconds={elapsedSeconds}
          onClose={reset}
          onPlayAgain={() => { reset(); initSolo(); }}
        />
      </div>
    </div>
  );
}
