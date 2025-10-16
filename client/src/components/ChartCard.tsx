import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Eye, Lock } from "lucide-react";
import { format } from "date-fns";

interface ChartCardProps {
  id: string;
  name: string;
  date: Date;
  location: string;
  chartType: string;
  sunSign?: string;
  moonSign?: string;
  rising?: string;
  isPrivate: boolean;
  onClick?: () => void;
}

export function ChartCard({ id, name, date, location, chartType, sunSign, moonSign, rising, isPrivate, onClick }: ChartCardProps) {
  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all" 
      onClick={onClick}
      data-testid={`card-chart-${id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{name}</CardTitle>
          <Badge variant={isPrivate ? "secondary" : "outline"} className="shrink-0">
            {isPrivate ? <Lock className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span data-testid={`text-date-${id}`}>{format(date, "MMM d, yyyy h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span data-testid={`text-location-${id}`}>{location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">{chartType}</Badge>
          {sunSign && <Badge variant="outline" className="text-xs">☉ {sunSign}</Badge>}
          {moonSign && <Badge variant="outline" className="text-xs">☽ {moonSign}</Badge>}
          {rising && <Badge variant="outline" className="text-xs">↑ {rising}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
