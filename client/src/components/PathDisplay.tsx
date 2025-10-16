import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface PathNode {
  name: string;
  type: string;
}

interface PathDisplayProps {
  path: PathNode[];
  relationships: string[];
  onClick?: () => void;
}

export function PathDisplay({ path, relationships, onClick }: PathDisplayProps) {
  return (
    <Card 
      className="hover-elevate cursor-pointer" 
      onClick={onClick}
      data-testid="card-path"
    >
      <CardContent className="pt-6">
        <div className="flex items-center flex-wrap gap-2">
          {path.map((node, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {node.name}
              </Badge>
              {idx < path.length - 1 && (
                <div className="flex flex-col items-center gap-0.5">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    {relationships[idx]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
