"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useTheme } from "next-themes"
import { PLACEHOLDER_AVATAR } from "@/lib/placeholders"

export function ThemePreview() {
  const { theme } = useTheme()

  const getThemeDescription = () => {
    switch (theme) {
      case 'light':
        return 'Clean and bright interface with neutral colors'
      case 'light-blue':
        return 'Soft blue tones with a calming, modern feel'
      case 'dark':
        return 'Dark interface perfect for low-light environments'
      case 'system':
        return 'Automatically switches between light and dark based on your system preference'
      default:
        return 'Theme will load after component mounts'
    }
  }

  const getThemeName = () => {
    switch (theme) {
      case 'light':
        return 'Light Theme'
      case 'light-blue':
        return 'Light Blue Theme'
      case 'dark':
        return 'Dark Theme'
      case 'system':
        return 'System Theme'
      default:
        return 'Loading...'
    }
  }

  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Current Theme: {getThemeName()}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {getThemeDescription()}
            </p>
            <ThemeToggle variant="segmented" className="w-full" />
          </div>
        </CardContent>
      </Card>

      <Card variant="floating">
        <CardHeader>
          <CardTitle>Theme Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 space-y-4 gradient-overlay">
            {/* Sample Header */}
            <div className="flex items-center justify-between border-b pb-3 depth-1 rounded-lg p-3 bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center button-3d">
                  <span className="text-sm font-bold">C</span>
                </div>
                <span className="font-bold">Connectify</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Icons.bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icons.mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sample Post */}
            <div className="space-y-3 interactive-depth rounded-lg p-3 bg-card border">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={PLACEHOLDER_AVATAR} alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">@johndoe • 2h</div>
                </div>
              </div>
              <p className="text-sm">
                Check out this amazing new theme! The colors work perfectly with the interface design.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Icons.heart className="h-4 w-4" />
                  <span>12</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Icons.messageCircle className="h-4 w-4" />
                  <span>3</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Icons.share className="h-4 w-4" />
                  <span>1</span>
                </Button>
              </div>
            </div>

            {/* Sample Buttons */}
            <div className="flex flex-wrap gap-2 pt-3 border-t">
              <Button size="sm">Primary Button</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 