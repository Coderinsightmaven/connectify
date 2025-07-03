"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

interface ThemeToggleProps {
  variant?: "icon" | "dropdown" | "segmented"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ThemeToggle({ variant = "icon", size = "md", className }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Always render the same structure during SSR to prevent hydration mismatch
  if (!mounted) {
    if (variant === "segmented") {
      return (
        <div className={`grid grid-cols-2 gap-1 rounded-lg border bg-background p-1 card-elevated ${className}`} suppressHydrationWarning>
          <Button variant="ghost" size="sm" disabled className="h-7 px-2">
            <Icons.sun className="h-3 w-3 mr-1" />
            Light
          </Button>
          <Button variant="ghost" size="sm" disabled className="h-7 px-2">
            <Icons.droplet className="h-3 w-3 mr-1" />
            Blue
          </Button>
          <Button variant="ghost" size="sm" disabled className="h-7 px-2">
            <Icons.moon className="h-3 w-3 mr-1" />
            Dark
          </Button>
          <Button variant="ghost" size="sm" disabled className="h-7 px-2">
            <Icons.user className="h-3 w-3 mr-1" />
            System
          </Button>
        </div>
      )
    }
    
    return (
      <Button
        variant="ghost"
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
        className={className}
        disabled
        suppressHydrationWarning
      >
        <Icons.sun className="h-4 w-4" />
      </Button>
    )
  }

  const toggleTheme = () => {
    const themes = ['light', 'light-blue', 'dark', 'system']
    const currentIndex = themes.indexOf(theme || 'system')
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  if (variant === "icon") {
    const getCurrentIcon = () => {
      switch (theme) {
        case 'light':
          return <Icons.sun className="h-4 w-4" />
        case 'light-blue':
          return <Icons.droplet className="h-4 w-4" />
        case 'dark':
          return <Icons.moon className="h-4 w-4" />
        case 'system':
          return <Icons.user className="h-4 w-4" />
        default:
          return <Icons.sun className="h-4 w-4" />
      }
    }

    return (
      <Button
        variant="ghost"
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
        onClick={toggleTheme}
        className={className}
        suppressHydrationWarning
      >
        {getCurrentIcon()}
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  if (variant === "segmented") {
    return (
      <div className={`grid grid-cols-2 gap-1 rounded-lg border bg-background p-1 card-elevated ${className}`} suppressHydrationWarning>
        <Button
          variant={theme === "light" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme("light")}
          className="h-7 px-2"
        >
          <Icons.sun className="h-3 w-3 mr-1" />
          Light
        </Button>
        <Button
          variant={theme === "light-blue" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme("light-blue")}
          className="h-7 px-2"
        >
          <Icons.droplet className="h-3 w-3 mr-1" />
          Blue
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme("dark")}
          className="h-7 px-2"
        >
          <Icons.moon className="h-3 w-3 mr-1" />
          Dark
        </Button>
        <Button
          variant={theme === "system" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme("system")}
          className="h-7 px-2"
        >
          <Icons.user className="h-3 w-3 mr-1" />
          System
        </Button>
      </div>
    )
  }

  // Dropdown variant (simplified version)
  return (
    <div className={`flex flex-col gap-1 ${className}`} suppressHydrationWarning>
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
        className="justify-start"
      >
        <Icons.sun className="h-4 w-4 mr-2" />
        Light
      </Button>
      <Button
        variant={theme === "light-blue" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("light-blue")}
        className="justify-start"
      >
        <Icons.droplet className="h-4 w-4 mr-2" />
        Light Blue
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="justify-start"
      >
        <Icons.moon className="h-4 w-4 mr-2" />
        Dark
      </Button>
      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("system")}
        className="justify-start"
      >
        <Icons.user className="h-4 w-4 mr-2" />
        System
      </Button>
    </div>
  )
} 