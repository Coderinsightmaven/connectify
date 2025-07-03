"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { cn } from "@/lib/utils"
import { usePostsStore, useUserStore } from "@/stores"

interface TrendingSidebarProps {
  className?: string
}

export function TrendingSidebar({ className }: TrendingSidebarProps) {
  const { trendingTopics, suggestedUsers } = usePostsStore()
  const { followUser, unfollowUser, following } = useUserStore()

  const handleFollow = (userId: string) => {
    const user = suggestedUsers.find(u => u.id === userId)
    if (user) {
      const isFollowing = following.some(f => f.id === userId)
      if (isFollowing) {
        unfollowUser(userId)
      } else {
        followUser(user)
      }
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Trending for you</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((trend) => (
            <div key={trend.id} className="flex items-center justify-between hover:bg-muted/50 rounded-lg p-2 cursor-pointer transition-colors">
              <div>
                <p className="font-medium text-sm">{trend.name}</p>
                <p className="text-xs text-muted-foreground">
                  {trend.postsCount.toLocaleString()} posts
                  <span className="ml-1">
                    {trend.trend === 'up' && '📈'}
                    {trend.trend === 'down' && '📉'}
                    {trend.trend === 'stable' && '➡️'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedUsers.map((user) => {
            const isFollowing = following.some(f => f.id === user.id)
            return (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm flex items-center gap-1">
                      {user.name}
                      {user.verified && <span className="text-primary">✓</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.followersCount.toLocaleString()} followers
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={isFollowing ? "outline" : "default"}
                  onClick={() => handleFollow(user.id)}
                  className="h-8 px-3 text-xs"
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Posts this week</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Likes received</span>
            <span className="font-medium">89</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">New followers</span>
            <span className="font-medium">7</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 