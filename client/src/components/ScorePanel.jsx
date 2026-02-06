export default function ScorePanel({ playerNames, scores, currentPlayerIndex, moves, elapsedSeconds, mode }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-6">
      {playerNames.map((name, i) => (
        <div
          key={i}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300
            ${i === currentPlayerIndex
              ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20'
              : 'border-slate-600 bg-slate-800/50'
            }
          `}
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-slate-700 text-white"
            title={name}
          >
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span className="font-semibold text-slate-200 truncate max-w-[80px] sm:max-w-[120px]" title={name}>
            {name}
          </span>
          <span
            className={`
              font-bold tabular-nums min-w-[2.5rem] text-right transition-transform duration-200
              ${scores[i] <= 20 ? 'text-red-400 animate-pulse' : scores[i] <= 50 ? 'text-amber-400' : 'text-emerald-400'}
            `}
          >
            {scores[i]}
          </span>
        </div>
      ))}
      {mode === 'solo' && (
        <div className="flex gap-4 text-slate-400 text-sm">
          {typeof moves === 'number' && <span>Moves: <strong className="text-slate-200">{moves}</strong></span>}
          {typeof elapsedSeconds === 'number' && (
            <span>Time: <strong className="text-slate-200">{formatTime(elapsedSeconds)}</strong></span>
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
