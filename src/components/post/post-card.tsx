"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { TimeAgo } from "@/components/ui/time"
import { Post } from "@/stores"

interface PostCardProps {
  post: Post
  className?: string
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onBookmark?: (postId: string) => void
}

export function PostCard({ 
  post, 
  className, 
  onLike, 
  onComment, 
  onShare, 
  onBookmark 
}: PostCardProps) {
  const handleLike = () => {
    onLike?.(post.id)
  }

  const handleBookmark = () => {
    onBookmark?.(post.id)
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-start space-y-0 pb-3">
        <div className="flex items-start space-x-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>
              {post.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold">{post.author.name}</h4>
              <span className="text-sm text-muted-foreground">@{post.author.username}</span>
              <span className="text-sm text-muted-foreground">·</span>
              <TimeAgo 
                date={new Date(post.createdAt)}
                className="text-sm text-muted-foreground"
              />
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
          <Icons.moreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post Content */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{post.content}</p>
          
          {/* Post Image */}
          {post.images && post.images.length > 0 && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={post.images[0]}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t mt-4" suppressHydrationWarning>
          <div className="flex items-center space-x-4">
            {/* Like */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center space-x-2 h-8 px-2",
                post.isLiked && "text-like"
              )}
            >
              {post.isLiked ? (
                <Icons.heartFilled className="h-4 w-4" />
              ) : (
                <Icons.heart className="h-4 w-4" />
              )}
              <span className="text-xs">{post.likesCount}</span>
            </Button>

            {/* Comment */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
              className="flex items-center space-x-2 h-8 px-2"
            >
              <Icons.messageCircle className="h-4 w-4" />
              <span className="text-xs">{post.commentsCount}</span>
            </Button>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="flex items-center space-x-2 h-8 px-2"
            >
              <Icons.share className="h-4 w-4" />
              <span className="text-xs">{post.sharesCount}</span>
            </Button>
          </div>

          {/* Bookmark */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={cn(
              "h-8 w-8",
              post.isBookmarked && "text-primary"
            )}
          >
            <Icons.bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 