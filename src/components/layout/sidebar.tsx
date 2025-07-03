"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const sidebarNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Icons.home,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: Icons.search,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Icons.bell,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: Icons.mail,
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
    icon: Icons.bookmark,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: Icons.user,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Icons.settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
        
        {/* Create Post Button */}
        <div className="px-3">
          <Button className="w-full" size="lg">
            <Icons.plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>
    </div>
  )
}

interface MobileSidebarProps {
  className?: string
}

export function MobileSidebar({ className }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 bg-background border-t", className)}>
      <nav className="flex items-center justify-around py-2">
        {sidebarNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 