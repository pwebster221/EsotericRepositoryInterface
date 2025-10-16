import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";

interface TodayCardProps {
  moonSign: string;
  moonPhase?: string;
  sunSignChange?: { from: string; to: string };
}

export function TodayCard({ moonSign, moonPhase, sunSignChange }: TodayCardProps) {
  return (
    <Card className="border-primary/20" data-testid="card-today">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Moon className="h-5 w-5 text-primary" />
          Today's Cosmic Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Moon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Moon in</span>
          <span className="font-medium" data-testid="text-moon-sign">{moonSign}</span>
        </div>
        {moonPhase && (
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <span className="font-medium text-primary" data-testid="text-moon-phase">{moonPhase}</span>
          </div>
        )}
        {sunSignChange && (
          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">Sun enters</span>
            <span className="font-medium text-amber-500" data-testid="text-sun-sign">{sunSignChange.to}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
