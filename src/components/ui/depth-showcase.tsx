"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DepthShowcase() {
  return (
    <div className="space-y-8 p-6">
      {/* Depth Layers */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Depth Layers</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="depth-1 p-4 rounded-lg bg-card text-center">
            <div className="text-sm font-medium">Depth 1</div>
            <div className="text-xs text-muted-foreground">Subtle</div>
          </div>
          <div className="depth-2 p-4 rounded-lg bg-card text-center">
            <div className="text-sm font-medium">Depth 2</div>
            <div className="text-xs text-muted-foreground">Light</div>
          </div>
          <div className="depth-3 p-4 rounded-lg bg-card text-center">
            <div className="text-sm font-medium">Depth 3</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </div>
          <div className="depth-4 p-4 rounded-lg bg-card text-center">
            <div className="text-sm font-medium">Depth 4</div>
            <div className="text-xs text-muted-foreground">Strong</div>
          </div>
          <div className="depth-5 p-4 rounded-lg bg-card text-center">
            <div className="text-sm font-medium">Depth 5</div>
            <div className="text-xs text-muted-foreground">Maximum</div>
          </div>
        </div>
      </section>

      {/* Card Variants */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Card Variants</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="default">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Standard card</p>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Elevated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Hover to see effect</p>
            </CardContent>
          </Card>
          
          <Card variant="floating">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Floating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Subtle animation</p>
            </CardContent>
          </Card>
          
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Glass</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Glassmorphism</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Elements */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Interactive Elements</h3>
        <div className="space-y-4">
          <div className="interactive-depth p-4 rounded-lg bg-card border">
            <h4 className="font-medium mb-2">Interactive Depth Card</h4>
            <p className="text-sm text-muted-foreground">Hover over this card to see it lift up with enhanced shadows</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button>3D Primary</Button>
            <Button variant="secondary">3D Secondary</Button>
            <Button variant="outline">3D Outline</Button>
            <Button variant="destructive">3D Destructive</Button>
          </div>
        </div>
      </section>

      {/* Special Effects */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Special Effects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-effect p-6 rounded-lg">
            <h4 className="font-medium mb-2">Glass Morphism</h4>
            <p className="text-sm text-muted-foreground">
              Translucent background with blur effect creates a modern glass-like appearance
            </p>
          </div>
          
          <div className="gradient-overlay p-6 rounded-lg bg-card border">
            <h4 className="font-medium mb-2">Gradient Overlay</h4>
            <p className="text-sm text-muted-foreground">
              Subtle gradient overlay adds depth and visual interest to components
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 