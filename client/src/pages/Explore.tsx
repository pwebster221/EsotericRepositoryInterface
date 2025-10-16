import { useState } from "react";
import { GraphNode } from "@/components/GraphNode";
import { PathDisplay } from "@/components/PathDisplay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Search, ArrowRight } from "lucide-react";

export default function Explore() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [pathFrom, setPathFrom] = useState("");
  const [pathTo, setPathTo] = useState("");

  //todo: remove mock functionality
  const mockNodes = [
    { name: "The Hermit", type: "TarotCard" as const, keywords: "introspection, solitude, wisdom" },
    { name: "Virgo", type: "ZodiacSign" as const, keywords: "analytical, practical, service" },
    { name: "Mercury", type: "Planet" as const, keywords: "communication, intellect, swift" },
    { name: "Fehu", type: "Rune" as const, keywords: "wealth, abundance, prosperity" },
    { name: "Earth", type: "Element" as const, keywords: "grounding, stability, material" },
  ];

  const mockPaths = [
    {
      path: [
        { name: "The Hermit", type: "TarotCard" },
        { name: "Virgo", type: "ZodiacSign" },
        { name: "Mercury", type: "Planet" },
      ],
      relationships: ["ASSOCIATED_WITH_SIGN", "RULED_BY"],
    },
    {
      path: [
        { name: "The Hermit", type: "TarotCard" },
        { name: "Earth", type: "Element" },
        { name: "Virgo", type: "ZodiacSign" },
      ],
      relationships: ["ELEMENTAL_ASSOCIATION", "HAS_ELEMENT"],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2" data-testid="text-explore-title">
          Graph Explorer
        </h1>
        <p className="text-muted-foreground">
          Navigate the web of symbolic correspondences
        </p>
      </div>

      <Tabs defaultValue="nodes" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="nodes" data-testid="tab-nodes">Node Explorer</TabsTrigger>
          <TabsTrigger value="paths" data-testid="tab-paths">Path Finder</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              className="pl-10"
              data-testid="input-search-nodes"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockNodes.map((node) => (
              <GraphNode
                key={node.name}
                {...node}
                isSelected={selectedNode === node.name}
                onClick={() => {
                  setSelectedNode(node.name);
                  console.log(`Selected: ${node.name}`);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="path-from">From Node</Label>
              <Input
                id="path-from"
                placeholder="e.g., The Hermit"
                value={pathFrom}
                onChange={(e) => setPathFrom(e.target.value)}
                data-testid="input-path-from"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="path-to">To Node</Label>
              <Input
                id="path-to"
                placeholder="e.g., Mercury"
                value={pathTo}
                onChange={(e) => setPathTo(e.target.value)}
                data-testid="input-path-to"
              />
            </div>
          </div>

          <Button 
            className="w-full md:w-auto" 
            onClick={() => console.log(`Finding path from ${pathFrom} to ${pathTo}`)}
            data-testid="button-find-paths"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Find Paths
          </Button>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Found Paths</h3>
            {mockPaths.map((pathData, idx) => (
              <PathDisplay
                key={idx}
                {...pathData}
                onClick={() => console.log(`Path ${idx + 1} clicked`)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
