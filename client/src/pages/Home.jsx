import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-display">
      <div className="text-center max-w-lg mx-auto animate-pop-in">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
          Memory Card Game
        </h1>
        <p className="text-slate-400 mb-10 text-lg">
          Match the Greek letters. Solo, local, or online — your choice.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/solo"
            className="group flex flex-col items-center p-6 rounded-2xl bg-slate-800/80 border-2 border-slate-600 hover:border-violet-500 hover:bg-slate-800 transition-all"
          >
            <span className="text-3xl mb-2" aria-hidden>🧍</span>
            <span className="font-semibold text-white group-hover:text-violet-300">Solo</span>
            <span className="text-sm text-slate-400 mt-1">Play alone, beat your score</span>
          </Link>
          <Link
            to="/local"
            className="group flex flex-col items-center p-6 rounded-2xl bg-slate-800/80 border-2 border-slate-600 hover:border-amber-500 hover:bg-slate-800 transition-all"
          >
            <span className="text-3xl mb-2" aria-hidden>👥</span>
            <span className="font-semibold text-white group-hover:text-amber-300">Local</span>
            <span className="text-sm text-slate-400 mt-1">2 players, same device</span>
          </Link>
          <Link
            to="/online"
            className="group flex flex-col items-center p-6 rounded-2xl bg-slate-800/80 border-2 border-slate-600 hover:border-emerald-500 hover:bg-slate-800 transition-all"
          >
            <span className="text-3xl mb-2" aria-hidden>🌍</span>
            <span className="font-semibold text-white group-hover:text-emerald-300">Online</span>
            <span className="text-sm text-slate-400 mt-1">Invite link or random match</span>
          </Link>
        </div>

        <p className="text-slate-500 text-sm mt-8">
          Rules: 100 points to start. −4 per wrong match. Game ends at 0 or when all pairs match.
        </p>
      </div>
    </div>
  );
}
