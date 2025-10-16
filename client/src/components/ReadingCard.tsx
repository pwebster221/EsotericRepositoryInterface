import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Lock } from "lucide-react";
import { format } from "date-fns";

interface ReadingCardProps {
  id: string;
  spreadType: string;
  date: Date;
  cards: string[];
  question?: string;
  isPrivate: boolean;
  onClick?: () => void;
}

export function ReadingCard({ id, spreadType, date, cards, question, isPrivate, onClick }: ReadingCardProps) {
  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all" 
      onClick={onClick}
      data-testid={`card-reading-${id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{spreadType}</CardTitle>
          <Badge variant={isPrivate ? "secondary" : "outline"} className="shrink-0">
            {isPrivate ? <Lock className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span data-testid={`text-date-${id}`}>{format(date, "MMM d, yyyy")}</span>
        </div>
        {question && (
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-question-${id}`}>
            {question}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {cards.slice(0, 3).map((card, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {card}
            </Badge>
          ))}
          {cards.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{cards.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
