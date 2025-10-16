import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Moon, Star, Wand2, Circle } from "lucide-react";

interface GraphNodeProps {
  name: string;
  type: "TarotCard" | "ZodiacSign" | "Planet" | "Rune" | "Element" | "Other";
  keywords?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const nodeIcons = {
  TarotCard: Sparkles,
  ZodiacSign: Star,
  Planet: Moon,
  Rune: Wand2,
  Element: Circle,
  Other: Circle,
};

const nodeColors = {
  TarotCard: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  ZodiacSign: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  Planet: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  Rune: "bg-green-500/10 border-green-500/30 text-green-400",
  Element: "bg-red-500/10 border-red-500/30 text-red-400",
  Other: "bg-muted/50 border-muted text-muted-foreground",
};

export function GraphNode({ name, type, keywords, onClick, isSelected }: GraphNodeProps) {
  const Icon = nodeIcons[type];
  const colorClass = nodeColors[type];

  return (
    <Card
      className={`hover-elevate cursor-pointer transition-all p-4 ${colorClass} ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
      data-testid={`node-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{name}</h3>
          {keywords && (
            <p className="text-xs opacity-80 truncate">{keywords}</p>
          )}
        </div>
        <Badge variant="outline" className="text-xs shrink-0">
          {type.replace(/([A-Z])/g, " $1").trim()}
        </Badge>
      </div>
    </Card>
  );
}
