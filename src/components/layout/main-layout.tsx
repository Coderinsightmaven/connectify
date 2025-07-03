"use client"

import * as React from "react"
import { Header } from "./header"
import { Sidebar, MobileSidebar } from "./sidebar"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  showSidebar?: boolean
}

export function MainLayout({ 
  children, 
  className, 
  showSidebar = true 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto">
        <div className="flex min-h-[calc(100vh-3.5rem)]">
          {/* Desktop Sidebar */}
          {showSidebar && (
            <aside className="hidden md:flex w-64 flex-col border-r bg-background p-4">
              <Sidebar />
            </aside>
          )}
          
          {/* Main Content */}
          <main className={cn(
            "flex-1 p-4 pb-20 md:pb-4",
            showSidebar && "md:pl-6",
            className
          )}>
            {children}
          </main>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      {showSidebar && (
        <div className="md:hidden">
          <MobileSidebar />
        </div>
      )}
    </div>
  )
} 