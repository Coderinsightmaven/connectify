"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { Badge } from "@/components/ui/badge"
import { useUserStore } from "@/stores"

export function ProfileHeader() {
  const { currentUser } = useUserStore()
  const [isEditing, setIsEditing] = useState(false)

  // If no user data, show loading or placeholder
  if (!currentUser) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="relative px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            <div className="relative -mt-16 sm:-mt-20">
              <div className="h-32 w-32 rounded-full bg-muted border-4 border-background"></div>
            </div>
            <div className="mt-4 space-y-3 flex-1">
              <div className="h-6 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="relative px-4">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
          <div className="relative -mt-16 sm:-mt-20">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="text-2xl">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Icons.user className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex-1 flex justify-end mt-4 sm:mt-0">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Icons.user className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Icons.user className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              {currentUser.verified && (
                <Badge variant="default" className="bg-blue-500">
                  ✓ Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">@{currentUser.username}</p>
          </div>

          {currentUser.bio && (
            <p className="text-foreground">{currentUser.bio}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {currentUser.location && (
              <div className="flex items-center space-x-1">
                <Icons.user className="h-4 w-4" />
                <span>{currentUser.location}</span>
              </div>
            )}
            {currentUser.website && (
              <div className="flex items-center space-x-1">
                <Icons.user className="h-4 w-4" />
                <a 
                  href={currentUser.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {currentUser.website.replace('https://', '')}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Icons.user className="h-4 w-4" />
              <span>Joined {currentUser.joinDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-6 text-sm">
            <div className="flex space-x-1">
              <span className="font-semibold">{currentUser.followingCount.toLocaleString()}</span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex space-x-1">
              <span className="font-semibold">{currentUser.followersCount.toLocaleString()}</span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex space-x-1">
              <span className="font-semibold">{currentUser.postsCount.toLocaleString()}</span>
              <span className="text-muted-foreground">Posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 