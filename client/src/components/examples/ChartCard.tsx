import { ChartCard } from '../ChartCard';

export default function ChartCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <ChartCard
        id="1"
        name="My Natal Chart"
        date={new Date('1989-01-06T15:10:00')}
        location="Durham, NC"
        chartType="Natal"
        sunSign="Capricorn"
        moonSign="Scorpio"
        rising="Gemini"
        isPrivate={true}
        onClick={() => console.log('Chart 1 clicked')}
      />
      <ChartCard
        id="2"
        name="Transit Chart"
        date={new Date('2025-01-10T12:00:00')}
        location="New York, NY"
        chartType="Transit"
        isPrivate={false}
        onClick={() => console.log('Chart 2 clicked')}
      />
    </div>
  );
}
