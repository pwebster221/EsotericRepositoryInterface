import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@lib/queryClient";
import { GraphNode } from "@/components/GraphNode";
import { PathDisplay } from "@/components/PathDisplay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowRight, Network, GitFork, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types for graph data
interface GraphNodeData {
  properties: Record<string, any>;
  labels: string[];
}

interface RelatedNode {
  node: Record<string, any>;
  relationship: string;
  labels: string[];
}

interface PathData {
  path: {
    nodes: GraphNodeData[];
    relationships: string[];
    length: number;
  };
}

export default function Explore() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pathFrom, setPathFrom] = useState("");
  const [pathTo, setPathTo] = useState("");
  const [patternSearch, setPatternSearch] = useState({
    nodeType: "",
    connectedTo: "",
  });
  const { toast } = useToast();

  // Check Neo4j connection status
  const { data: graphStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/graph/stats"],
  });

  // Node search
  const nodeSearchMutation = useMutation({
    mutationFn: async (nodeName: string) => {
      return await apiRequest(`/api/graph/node/${encodeURIComponent(nodeName)}`);
    },
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['/api/graph/current-node'] });
      }
    },
    onError: () => {
      toast({
        title: "Search Failed",
        description: "Unable to find node in the graph",
        variant: "destructive",
      });
    },
  });

  // Path finding
  const pathFindMutation = useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      const response = await fetch(`/api/graph/path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      if (!response.ok) throw new Error("Failed to find path");
      return response.json();
    },
    onError: () => {
      toast({
        title: "Path Search Failed",
        description: "Unable to find path between nodes",
        variant: "destructive",
      });
    },
  });

  // Pattern search
  const patternSearchMutation = useMutation({
    mutationFn: async (pattern: any) => {
      return await apiRequest("/api/graph/search", {
        method: "POST",
        body: JSON.stringify(pattern),
      });
    },
    onError: () => {
      toast({
        title: "Pattern Search Failed",
        description: "Unable to search pattern in the graph",
        variant: "destructive",
      });
    },
  });

  const handleNodeSearch = () => {
    if (searchQuery.trim()) {
      nodeSearchMutation.mutate(searchQuery);
    }
  };

  const handlePathFind = () => {
    if (pathFrom.trim() && pathTo.trim()) {
      pathFindMutation.mutate({ from: pathFrom, to: pathTo });
    }
  };

  const handlePatternSearch = () => {
    const pattern: any = {};
    if (patternSearch.nodeType) pattern.nodeType = patternSearch.nodeType;
    if (patternSearch.connectedTo) pattern.connectedTo = patternSearch.connectedTo;
    
    patternSearchMutation.mutate(pattern);
  };

  // Show connection error if Neo4j is not connected
  if (statsError || graphStats?.error) {
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

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Neo4j graph database is not connected. Please configure the Neo4j connection with NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD environment variables.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Demo Mode</CardTitle>
            <CardDescription>
              The graph database will contain nodes for Tarot cards, Zodiac signs, Planets, Elements, and Kabbalistic concepts with their interconnections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Once connected, you'll be able to explore relationships between symbols, find paths between concepts, and search for patterns in the esoteric knowledge graph.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      {/* Graph Statistics */}
      {graphStats && !graphStats.error && (
        <div className="flex gap-4 text-sm">
          <Badge variant="secondary">
            <Network className="mr-1 h-3 w-3" />
            {graphStats.nodeCount} nodes
          </Badge>
          <Badge variant="secondary">
            <GitFork className="mr-1 h-3 w-3" />
            {graphStats.relationshipCount} relationships
          </Badge>
        </div>
      )}

      <Tabs defaultValue="path" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="path" data-testid="tab-paths">Path Finder</TabsTrigger>
          <TabsTrigger value="pattern" data-testid="tab-pattern">Pattern Search</TabsTrigger>
        </TabsList>

        {/* Path Finder Tab */}
        <TabsContent value="path" className="space-y-6 mt-6">
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
            onClick={handlePathFind}
            disabled={pathFindMutation.isPending}
            data-testid="button-find-paths"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            {pathFindMutation.isPending ? "Finding..." : "Find Paths"}
          </Button>

          {pathFindMutation.data && pathFindMutation.data.path && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Path Found</h3>
              <PathDisplay
                path={pathFindMutation.data.path.nodes.map((n: GraphNodeData) => ({
                  name: n.properties.name || n.properties.label || "Unknown",
                  type: n.labels[0] || "Unknown"
                }))}
                relationships={pathFindMutation.data.path.relationships}
                onClick={() => {}}
              />
            </div>
          )}

          {pathFindMutation.data && pathFindMutation.data.message && (
            <Alert>
              <AlertDescription>{pathFindMutation.data.message}</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Pattern Search Tab */}
        <TabsContent value="pattern" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="node-type">Node Type (optional)</Label>
              <Select value={patternSearch.nodeType} onValueChange={(value) => setPatternSearch(prev => ({ ...prev, nodeType: value }))}>
                <SelectTrigger id="node-type" data-testid="select-node-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="TarotCard">Tarot Card</SelectItem>
                  <SelectItem value="ZodiacSign">Zodiac Sign</SelectItem>
                  <SelectItem value="Planet">Planet</SelectItem>
                  <SelectItem value="Element">Element</SelectItem>
                  <SelectItem value="Sephirah">Sephirah</SelectItem>
                  <SelectItem value="Rune">Rune</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="connected-to">Connected To (optional)</Label>
              <Input
                id="connected-to"
                placeholder="e.g., The Moon"
                value={patternSearch.connectedTo}
                onChange={(e) => setPatternSearch(prev => ({ ...prev, connectedTo: e.target.value }))}
                data-testid="input-connected-to"
              />
            </div>
          </div>

          <Button 
            className="w-full md:w-auto" 
            onClick={handlePatternSearch}
            disabled={patternSearchMutation.isPending}
            data-testid="button-pattern-search"
          >
            <Search className="mr-2 h-4 w-4" />
            {patternSearchMutation.isPending ? "Searching..." : "Search Pattern"}
          </Button>

          {patternSearchMutation.data && patternSearchMutation.data.nodes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Found {patternSearchMutation.data.nodes.length} nodes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patternSearchMutation.data.nodes.map((node: GraphNodeData, idx: number) => {
                  const name = node.properties.name || node.properties.label || "Unknown";
                  const type = node.labels[0] || "Unknown";
                  const keywords = node.properties.keywords || "";
                  
                  return (
                    <GraphNode
                      key={idx}
                      name={name}
                      type={type as any}
                      keywords={keywords}
                      isSelected={selectedNode === name}
                      onClick={() => {
                        setSelectedNode(name);
                        nodeSearchMutation.mutate(name);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {patternSearchMutation.data && patternSearchMutation.data.nodes && patternSearchMutation.data.nodes.length === 0 && (
            <Alert>
              <AlertDescription>No nodes found matching this pattern</AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Selected Node Details */}
      {nodeSearchMutation.data && !nodeSearchMutation.data.error && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{nodeSearchMutation.data.node.name || nodeSearchMutation.data.node.label}</CardTitle>
            <CardDescription>
              {nodeSearchMutation.data.labels.join(", ")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nodeSearchMutation.data.node.keywords && (
              <p className="text-sm text-muted-foreground mb-4">
                {nodeSearchMutation.data.node.keywords}
              </p>
            )}
            {nodeSearchMutation.data.relatedNodes && nodeSearchMutation.data.relatedNodes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Related Nodes:</h4>
                <div className="flex flex-wrap gap-2">
                  {nodeSearchMutation.data.relatedNodes.map((related: RelatedNode, idx: number) => (
                    <Badge 
                      key={idx} 
                      variant="secondary"
                      className="cursor-pointer hover-elevate"
                      onClick={() => {
                        const name = related.node.name || related.node.label;
                        setSelectedNode(name);
                        nodeSearchMutation.mutate(name);
                      }}
                      data-testid={`badge-related-${idx}`}
                    >
                      {related.node.name || related.node.label}
                      <span className="ml-1 text-xs opacity-70">({related.relationship})</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}