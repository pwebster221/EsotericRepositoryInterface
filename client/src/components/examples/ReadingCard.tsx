import { ReadingCard } from '../ReadingCard';

export default function ReadingCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <ReadingCard
        id="1"
        spreadType="Celtic Cross"
        date={new Date('2025-01-10')}
        cards={["The Hermit", "The Tower", "Ace of Cups", "Knight of Swords"]}
        question="What path should I take in my career?"
        isPrivate={true}
        onClick={() => console.log('Reading 1 clicked')}
      />
      <ReadingCard
        id="2"
        spreadType="Three Card"
        date={new Date('2025-01-08')}
        cards={["The Moon", "Seven of Pentacles"]}
        isPrivate={false}
        onClick={() => console.log('Reading 2 clicked')}
      />
    </div>
  );
}
