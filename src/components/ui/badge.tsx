import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
  className?: string
  children: React.ReactNode
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80":
            variant === "default",
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80":
            variant === "secondary",
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80":
            variant === "destructive",
          "text-foreground": variant === "outline",
          "border-transparent bg-success text-white shadow hover:bg-success/80":
            variant === "success",
          "border-transparent bg-warning text-white shadow hover:bg-warning/80":
            variant === "warning",
        },
        className
      )}
    >
      {children}
    </div>
  )
} 