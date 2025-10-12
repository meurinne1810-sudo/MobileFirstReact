import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Zap, Code2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-hero-title">
              Modern Web App
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-hero-description">
              A clean, minimal React + Vite + TypeScript starter built with mobile-first design principles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2" data-testid="text-feature-mobile">Mobile First</h3>
              <p className="text-muted-foreground">
                Designed for mobile devices with touch-friendly interactions and responsive layouts
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2" data-testid="text-feature-fast">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Powered by Vite for instant hot module replacement and optimized builds
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2" data-testid="text-feature-typescript">TypeScript</h3>
              <p className="text-muted-foreground">
                Full TypeScript support with strict mode for type-safe development
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" data-testid="button-get-started" onClick={() => console.log('Get started clicked')}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
