import { QuickActionCard } from '../QuickActionCard';
import { Sparkles, Star, Network } from 'lucide-react';

export default function QuickActionCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <QuickActionCard
        title="New Reading"
        description="Create a tarot reading with your preferred spread"
        icon={Sparkles}
        onClick={() => console.log('New Reading clicked')}
      />
      <QuickActionCard
        title="New Chart"
        description="Calculate a natal or transit chart"
        icon={Star}
        onClick={() => console.log('New Chart clicked')}
      />
      <QuickActionCard
        title="Explore Graph"
        description="Navigate symbolic correspondences"
        icon={Network}
        onClick={() => console.log('Explore Graph clicked')}
      />
    </div>
  );
}
