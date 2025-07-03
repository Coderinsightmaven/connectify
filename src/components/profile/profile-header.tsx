"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { Badge } from "@/components/ui/badge"
import { PLACEHOLDER_AVATAR } from "@/lib/placeholders"

// Mock user data - in a real app this would come from props or a data fetching hook
const userData = {
  name: "John Doe",
  username: "johndoe",
  bio: "Software developer passionate about creating amazing user experiences. Building the future one line of code at a time. 🚀",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  joinDate: "March 2020",
  followers: 1234,
  following: 567,
  posts: 89,
  verified: true,
  isOwnProfile: true, // In a real app, this would be determined by comparing with current user
}

export function ProfileHeader() {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        {userData.isOwnProfile && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
          >
            <Icons.user className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-4">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
          <div className="relative -mt-16 sm:-mt-20">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={PLACEHOLDER_AVATAR} alt={userData.name} />
              <AvatarFallback className="text-2xl">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {userData.isOwnProfile && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
              >
                <Icons.user className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex-1 flex justify-between items-center mt-4 sm:mt-0">
            <div></div>
            <div className="flex space-x-2">
              {userData.isOwnProfile ? (
                <>
                  <Button variant="outline">
                    <Icons.user className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="icon">
                    <Icons.share className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollow}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline">
                    <Icons.mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="icon">
                    <Icons.share className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              {userData.verified && (
                <Badge variant="default" className="bg-blue-500">
                  ✓ Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">@{userData.username}</p>
          </div>

          <p className="text-foreground">{userData.bio}</p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {userData.location && (
              <div className="flex items-center space-x-1">
                <Icons.user className="h-4 w-4" />
                <span>{userData.location}</span>
              </div>
            )}
            {userData.website && (
              <div className="flex items-center space-x-1">
                <Icons.user className="h-4 w-4" />
                <a 
                  href={userData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {userData.website.replace('https://', '')}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Icons.user className="h-4 w-4" />
              <span>Joined {userData.joinDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-6 text-sm">
            <div className="flex space-x-1">
              <span className="font-semibold">{formatNumber(userData.following)}</span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex space-x-1">
              <span className="font-semibold">{formatNumber(userData.followers)}</span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex space-x-1">
              <span className="font-semibold">{formatNumber(userData.posts)}</span>
              <span className="text-muted-foreground">Posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 