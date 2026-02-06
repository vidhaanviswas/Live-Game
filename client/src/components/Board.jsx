import Card from './Card';
import { GAME_CONFIG } from '../gameLogic/config';

export default function Board({
  deck,
  flippedIndices,
  canFlip,
  onFlip,
  flipBackIndices,
  flipDelay = GAME_CONFIG.flipDelay,
}) {
  return (
    <div
      className="grid gap-2 sm:gap-3 p-4 justify-center"
      style={{
        gridTemplateColumns: `repeat(4, minmax(0, 1fr))`,
      }}
    >
      {deck.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          isFlipped={flippedIndices.includes(index)}
          isMatched={card.matched}
          canFlip={canFlip}
          onFlip={onFlip}
          flipBack={flipBackIndices?.includes(index)}
        />
      ))}
    </div>
  );
}
