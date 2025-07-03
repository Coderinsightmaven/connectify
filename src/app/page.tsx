"use client"

import * as React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { PostCard } from "@/components/post/post-card"
import { TrendingSidebar } from "@/components/post/trending-sidebar"
import { usePostsStore } from "@/stores"

export default function HomePage() {
  const { 
    posts, 
    isLoading,
    likePost,
    unlikePost,
    bookmarkPost,
    unbookmarkPost,
    sharePost
  } = usePostsStore()

  const handleLike = (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (post?.isLiked) {
      unlikePost(postId)
    } else {
      likePost(postId)
    }
  }

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId)
    // In a real app, you would open a comment modal or navigate to post detail
  }

  const handleShare = (postId: string) => {
    sharePost(postId)
    // Additional share logic (copy link, social media, etc.)
  }

  const handleBookmark = (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (post?.isBookmarked) {
      unbookmarkPost(postId)
    } else {
      bookmarkPost(postId)
    }
  }

  return (
    <MainLayout>
      <div className="flex gap-6">
        {/* Main Feed */}
        <div className="flex-1 max-w-2xl">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h1 className="text-2xl font-bold">Home</h1>
              <p className="text-muted-foreground">
                Stay up to date with the latest from your network
              </p>
            </div>
            
            {/* Post Feed */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No posts to show. Follow some people to see their posts!
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-80">
          <div className="sticky top-20">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
