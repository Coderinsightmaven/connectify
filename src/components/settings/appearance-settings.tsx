"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemePreview } from "@/components/ui/theme-preview"
import { DepthShowcase } from "@/components/ui/depth-showcase"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { TimeExamples } from "@/components/ui/time-examples"
import { useSettingsStore } from "@/stores"

export function AppearanceSettings() {
  const { 
    appearance, 
    accessibility,
    updateAppearance, 
    updateAccessibility 
  } = useSettingsStore()

  const handleSave = () => {
    console.log("Appearance settings saved automatically via Zustand")
    // Settings are already persisted via Zustand persist middleware
  }

  return (
    <div className="space-y-6">
      {/* Theme Preview */}
      <ThemePreview />
      
      {/* 3D Effects Showcase */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>3D Effects & Depth</CardTitle>
          <CardDescription>
            Enhanced visual depth and interactive effects throughout the interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepthShowcase />
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader>
          <CardTitle>Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Font Size</h4>
            <div className="space-y-2">
              {[
                { value: "small", label: "Small", sample: "The quick brown fox..." },
                { value: "medium", label: "Medium", sample: "The quick brown fox..." },
                { value: "large", label: "Large", sample: "The quick brown fox..." }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-muted/50">
                  <input
                    type="radio"
                    name="fontSize"
                    value={option.value}
                    checked={appearance.fontSize === option.value}
                    onChange={(e) => updateAppearance({ fontSize: e.target.value as typeof appearance.fontSize })}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      <span 
                        className={`text-muted-foreground ${
                          option.value === "small" ? "text-sm" : 
                          option.value === "large" ? "text-lg" : ""
                        }`}
                      >
                        {option.sample}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Compact Mode</h4>
              <p className="text-sm text-muted-foreground">
                Show more content by reducing spacing
              </p>
            </div>
            <Switch
              checked={appearance.compactMode}
              onCheckedChange={(checked) => updateAppearance({ compactMode: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Autoplay Videos</h4>
              <p className="text-sm text-muted-foreground">
                Automatically play videos when they come into view
              </p>
            </div>
            <Switch
              checked={accessibility.autoplayVideos}
              onCheckedChange={(checked) => updateAccessibility({ autoplayVideos: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Reduced Motion</h4>
              <p className="text-sm text-muted-foreground">
                Reduce animations and transitions
              </p>
            </div>
            <Switch
              checked={appearance.reducedMotion}
              onCheckedChange={(checked) => updateAppearance({ reducedMotion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">High Contrast</h4>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              checked={appearance.highContrast}
              onCheckedChange={(checked) => updateAppearance({ highContrast: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Screen Reader Support</h4>
              <p className="text-sm text-muted-foreground">
                Enhanced support for screen readers
              </p>
            </div>
            <Switch
              checked={accessibility.screenReader}
              onCheckedChange={(checked) => updateAccessibility({ screenReader: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Keyboard Navigation</h4>
              <p className="text-sm text-muted-foreground">
                Enhanced keyboard navigation support
              </p>
            </div>
            <Switch
              checked={accessibility.keyboardNavigation}
              onCheckedChange={(checked) => updateAccessibility({ keyboardNavigation: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Alt Text for Images</h4>
              <p className="text-sm text-muted-foreground">
                Always show alt text for images
              </p>
            </div>
            <Switch
              checked={accessibility.altTextEnabled}
              onCheckedChange={(checked) => updateAccessibility({ altTextEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Theme Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary"></div>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground">@johndoe • 2h</div>
              </div>
            </div>
            <div>
              <p className={`${appearance.fontSize === "small" ? "text-sm" : appearance.fontSize === "large" ? "text-lg" : ""}`}>
                This is how your posts will appear with your current settings. 
                The design adapts to your preferences for the best experience.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>👍 12</span>
              <span>💬 3</span>
              <span>🔄 1</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Formatting Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Time Formatting</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            The app uses custom time components for consistent time formatting across all components.
          </p>
          <TimeExamples />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Settings Saved Automatically
        </Button>
      </div>
    </div>
  )
} 