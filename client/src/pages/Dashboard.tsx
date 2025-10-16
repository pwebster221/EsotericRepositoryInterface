import { TodayCard } from "@/components/TodayCard";
import { QuickActionCard } from "@/components/QuickActionCard";
import { ReadingCard } from "@/components/ReadingCard";
import { ChartCard } from "@/components/ChartCard";
import { Sparkles, Star, Network } from "lucide-react";

export default function Dashboard() {
  //todo: remove mock functionality
  const mockReadings = [
    {
      id: "1",
      spreadType: "Celtic Cross",
      date: new Date('2025-01-10'),
      cards: ["The Hermit", "The Tower", "Ace of Cups"],
      question: "What path should I take?",
      isPrivate: true,
    },
    {
      id: "2",
      spreadType: "Three Card",
      date: new Date('2025-01-08'),
      cards: ["The Moon", "Seven of Pentacles"],
      isPrivate: false,
    },
  ];

  const mockCharts = [
    {
      id: "1",
      name: "My Natal Chart",
      date: new Date('1989-01-06T15:10:00'),
      location: "Durham, NC",
      chartType: "Natal",
      sunSign: "Capricorn",
      moonSign: "Scorpio",
      rising: "Gemini",
      isPrivate: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2" data-testid="text-welcome">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Continue your journey through the symbolic universe
        </p>
      </div>

      <TodayCard
        moonSign="Pisces"
        moonPhase="Full Moon"
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="New Reading"
            description="Create a tarot reading with your preferred spread"
            icon={Sparkles}
            onClick={() => console.log('New Reading')}
          />
          <QuickActionCard
            title="New Chart"
            description="Calculate a natal or transit chart"
            icon={Star}
            onClick={() => console.log('New Chart')}
          />
          <QuickActionCard
            title="Explore Graph"
            description="Navigate symbolic correspondences"
            icon={Network}
            onClick={() => console.log('Explore Graph')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Readings</h2>
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

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCharts.map((chart) => (
            <ChartCard
              key={chart.id}
              {...chart}
              onClick={() => console.log(`Chart ${chart.id} clicked`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
