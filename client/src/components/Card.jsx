import { useState } from 'react';

export default function Card({ card, index, isFlipped, isMatched, canFlip, onFlip }) {
  const [animating, setAnimating] = useState(false);
  const showFront = isFlipped || isMatched;

  const handleClick = () => {
    if (!canFlip || isMatched || isFlipped || animating) return;
    setAnimating(true);
    onFlip(index);
    setTimeout(() => setAnimating(false), 350);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canFlip || isMatched || animating}
      className={`
        relative w-full aspect-[3/4] rounded-xl perspective-1000
        transition transform duration-200 hover:scale-[1.02] active:scale-[0.98]
        disabled:cursor-not-allowed disabled:hover:scale-100
        ${!canFlip && !isMatched ? 'opacity-80' : ''}
      `}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`card-inner relative w-full h-full transition-transform duration-300 ${showFront ? 'flipped' : ''}`}
      >
        <div
          className="card-face card-back absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg border-2 border-violet-400/50 flex items-center justify-center text-xl sm:text-2xl font-bold text-white/90"
          aria-hidden={showFront}
        >
          ?
        </div>
        <div
          className={`card-face card-front absolute inset-0 rounded-xl border-2 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-inner
            ${isMatched ? 'bg-emerald-600/80 border-emerald-400 text-white' : 'bg-slate-700 border-slate-500 text-white'}
          `}
          aria-hidden={!showFront}
        >
          {card.symbol}
        </div>
      </div>
    </button>
  );
}
