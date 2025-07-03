"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"

import { cn } from "@/lib/utils"
import { useUserStore } from "@/stores"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { currentUser } = useUserStore()

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 depth-4", className)}>
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">C</span>
            </div>
            <span className="hidden font-bold sm:inline-block">Connectify</span>
          </Link>
        </div>

        {/* Search */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>

          {/* Actions */}
          <nav className="flex items-center space-x-1">


            {/* Notifications */}
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Icons.bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
            </Link>

            {/* Messages */}
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Icons.mail className="h-4 w-4" />
                <span className="sr-only">Messages</span>
              </Button>
            </Link>

            {/* Random Chat */}
            <Link href="/video-chat">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Icons.video className="h-4 w-4" />
                <span className="sr-only">Random Chat</span>
              </Button>
            </Link>

            {/* Bookmarks */}
            <Link href="/bookmarks">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Icons.bookmark className="h-4 w-4" />
                <span className="sr-only">Bookmarks</span>
              </Button>
            </Link>

            {/* Profile */}
            <Link href="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name || "Profile"} />
                <AvatarFallback>
                  {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 