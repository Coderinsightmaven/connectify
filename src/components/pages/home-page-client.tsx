"use client"

import * as React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { PostCard } from "@/components/post/post-card"
import { TrendingSidebar } from "@/components/post/trending-sidebar"
import { usePostsStore, useUserStore } from "@/stores"
import { signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { LogOut, User, RefreshCw } from "lucide-react"
import type { auth } from "@/lib/auth"

type Session = typeof auth.$Infer.Session

interface HomePageClientProps {
  session: Session
}

export function HomePageClient({ session }: HomePageClientProps) {
  const { 
    posts, 
    isLoading,
    likePost,
    unlikePost,
    bookmarkPost,
    unbookmarkPost,
    sharePost,
    loadPosts,
    refreshPosts
  } = usePostsStore()

  const { currentUser, setCurrentUser, convertAuthUser } = useUserStore()

  // Load user data and posts on mount
  React.useEffect(() => {
    const loadData = async () => {
      // Update user data from session
      if (session?.user) {
        const user = convertAuthUser(session.user)
        setCurrentUser(user)
        
        // Fetch additional user data from API
        try {
          const response = await fetch('/api/users/me')
          const data = await response.json()
          if (data.success) {
            setCurrentUser(data.data.user)
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }

      // Load posts
      await loadPosts('home', true)
    }

    loadData()
  }, [session, loadPosts, setCurrentUser, convertAuthUser])

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

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = "/login"
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const handleRefresh = async () => {
    await refreshPosts()
  }

  return (
    <MainLayout>
      <div className="flex gap-6">
        {/* Main Feed */}
        <div className="flex-1 max-w-2xl">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Home</h1>
                  <p className="text-muted-foreground">
                    Stay up to date with the latest from your network
                  </p>
                </div>
                
                {/* User info and actions */}
                <div className="flex items-center gap-3">
                  {currentUser && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span className="text-muted-foreground">Welcome,</span>
                      <span className="font-medium">{currentUser.name}</span>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Post Feed */}
            <div className="space-y-4">
              {isLoading && posts.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-lg mb-2">No posts to show</p>
                  <p className="text-sm">
                    Follow some people to see their posts, or create your first post!
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleRefresh}
                  >
                    Refresh
                  </Button>
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