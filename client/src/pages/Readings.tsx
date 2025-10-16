import { ReadingCard } from "@/components/ReadingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Readings() {
  //todo: remove mock functionality
  const mockReadings = [
    {
      id: "1",
      spreadType: "Celtic Cross",
      date: new Date('2025-01-10'),
      cards: ["The Hermit", "The Tower", "Ace of Cups", "Knight of Swords"],
      question: "What path should I take in my career?",
      isPrivate: true,
    },
    {
      id: "2",
      spreadType: "Three Card",
      date: new Date('2025-01-08'),
      cards: ["The Moon", "Seven of Pentacles"],
      isPrivate: false,
    },
    {
      id: "3",
      spreadType: "Single Card",
      date: new Date('2025-01-05'),
      cards: ["The Star"],
      question: "What energy should I focus on today?",
      isPrivate: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2" data-testid="text-readings-title">
            Tarot Readings
          </h1>
          <p className="text-muted-foreground">
            Your personal collection of tarot readings
          </p>
        </div>
        <Button data-testid="button-new-reading">
          <Plus className="mr-2 h-4 w-4" />
          New Reading
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search readings by card, question, or date..."
          className="pl-10"
          data-testid="input-search-readings"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockReadings.map((reading) => (
          <ReadingCard
            key={reading.id}
            {...reading}
            onClick={() => console.log(`Reading ${reading.id} clicked`)}
          />
        ))}
      </div>
    </div>
  );
}
