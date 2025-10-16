import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Star, Network, Moon, Sun } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-background" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-display font-semibold text-primary">
            The Esoteric Repository
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Navigate the sacred web of symbolic correspondences. Store your tarot readings and astral charts in your personal spiritual sanctuary.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="min-w-[200px]"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Begin Your Journey
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-2 rounded-md bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Tarot Readings</h3>
                  <p className="text-sm text-muted-foreground">
                    Record your readings with full interpretations and track patterns over time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-2 rounded-md bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Astral Charts</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculate natal charts with Swiss Ephemeris precision
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-2 rounded-md bg-primary/10">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Graph Explorer</h3>
                  <p className="text-sm text-muted-foreground">
                    Navigate relationships between tarot, astrology, Kabbalah, and runes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>A sacred digital space for your spiritual journey</p>
        </div>
      </footer>
    </div>
  );
}