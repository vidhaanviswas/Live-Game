import { useNavigate } from 'react-router-dom';

export default function EndGameModal({
  open,
  title,
  message,
  winnerName,
  scores,
  moves,
  elapsedSeconds,
  onClose,
  onPlayAgain,
}) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div
        className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-pop-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="text-xl font-bold text-white mb-2">
          {title}
        </h2>
        <p className="text-slate-300 mb-4">{message}</p>
        {winnerName && (
          <p className="text-amber-400 font-semibold mb-2">Winner: {winnerName}</p>
        )}
        {scores?.length > 0 && (
          <div className="flex gap-4 justify-center text-slate-400 text-sm mb-4">
            {scores.map((s, i) => (
              <span key={i}>Score {i + 1}: <strong className="text-white">{s}</strong></span>
            ))}
          </div>
        )}
        {(typeof moves === 'number' || typeof elapsedSeconds === 'number') && (
          <p className="text-slate-400 text-sm mb-4">
            {typeof moves === 'number' && `Moves: ${moves}`}
            {typeof moves === 'number' && typeof elapsedSeconds === 'number' && ' · '}
            {typeof elapsedSeconds === 'number' && `Time: ${formatTime(elapsedSeconds)}`}
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => { onClose?.(); navigate('/'); }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-medium transition"
          >
            Home
          </button>
          {onPlayAgain && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="flex-1 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
