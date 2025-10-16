import { ChartCard } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Charts() {
  //todo: remove mock functionality
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
    {
      id: "2",
      name: "Transit Chart - January 2025",
      date: new Date('2025-01-10T12:00:00'),
      location: "New York, NY",
      chartType: "Transit",
      isPrivate: false,
    },
    {
      id: "3",
      name: "Solar Return 2025",
      date: new Date('2025-01-06T08:30:00'),
      location: "Durham, NC",
      chartType: "Solar Return",
      sunSign: "Capricorn",
      isPrivate: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2" data-testid="text-charts-title">
            Astral Charts
          </h1>
          <p className="text-muted-foreground">
            Your personal collection of astrological charts
          </p>
        </div>
        <Button data-testid="button-new-chart">
          <Plus className="mr-2 h-4 w-4" />
          New Chart
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search charts by name, location, or date..."
          className="pl-10"
          data-testid="input-search-charts"
        />
      </div>

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
  );
}
