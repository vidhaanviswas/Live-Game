export default function TurnIndicator({ currentPlayerIndex, playerNames }) {
  return (
    <p className="text-center text-slate-400 text-sm mb-2">
      <span className="text-amber-400 font-semibold">{playerNames[currentPlayerIndex]}</span>
      {' '}to play
    </p>
  );
}
