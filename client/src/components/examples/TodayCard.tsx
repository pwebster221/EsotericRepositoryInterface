import { TodayCard } from '../TodayCard';

export default function TodayCardExample() {
  return (
    <TodayCard
      moonSign="Pisces"
      moonPhase="Full Moon"
      sunSignChange={{ from: "Aquarius", to: "Pisces" }}
    />
  );
}
