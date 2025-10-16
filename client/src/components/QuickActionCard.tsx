import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  testId?: string;
}

export function QuickActionCard({ title, description, icon: Icon, onClick, testId }: QuickActionCardProps) {
  return (
    <Card
      className="hover-elevate active-elevate-2 cursor-pointer transition-all border-primary/20"
      onClick={onClick}
      data-testid={testId || `card-action-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 p-2 rounded-md bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
