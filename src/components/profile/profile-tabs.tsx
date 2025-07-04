"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post/post-card"
import { usePostsStore, useUserStore } from "@/stores"
import { useMemo } from "react"

export function ProfileTabs() {
  const { posts, likePost, unlikePost, bookmarkPost, unbookmarkPost, sharePost } = usePostsStore()
  const { currentUser } = useUserStore()

  // Filter posts by current user
  const userPosts = useMemo(() => {
    return posts.filter(post => post.author.id === currentUser?.id)
  }, [posts, currentUser?.id])

  // Filter liked posts by current user
  const likedPosts = useMemo(() => {
    return posts.filter(post => post.isLiked)
  }, [posts])

  // Filter media posts (posts with images)
  const mediaPosts = useMemo(() => {
    return userPosts.filter(post => post.images && post.images.length > 0)
  }, [userPosts])

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
  }

  const handleShare = (postId: string) => {
    sharePost(postId)
  }

  const handleBookmark = (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (post?.isBookmarked) {
      unbookmarkPost(postId)
    } else {
      bookmarkPost(postId)
    }
  }

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12 text-muted-foreground">
      <p className="text-lg">{message}</p>
      <p className="text-sm mt-2">Share your thoughts with the world!</p>
    </div>
  )

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="posts">Posts ({userPosts.length})</TabsTrigger>
        <TabsTrigger value="replies">Replies</TabsTrigger>
        <TabsTrigger value="media">Media ({mediaPosts.length})</TabsTrigger>
        <TabsTrigger value="likes">Likes ({likedPosts.length})</TabsTrigger>
      </TabsList>

      {/* User Posts */}
      <TabsContent value="posts" className="space-y-4 mt-6">
        {userPosts.length === 0 ? (
          <EmptyState message="No posts yet" />
        ) : (
          userPosts.map((post) => (
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
      </TabsContent>

      {/* Replies - Currently empty since we don't have reply functionality */}
      <TabsContent value="replies" className="space-y-4 mt-6">
        <EmptyState message="No replies yet" />
      </TabsContent>

      {/* Media Posts */}
      <TabsContent value="media" className="space-y-4 mt-6">
        {mediaPosts.length === 0 ? (
          <EmptyState message="No media posts yet" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mediaPosts.map((post) => (
              <div key={post.id} className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden">
                {post.images && post.images[0] && (
                  <img
                    src={post.images[0]}
                    alt="Post media"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Liked Posts */}
      <TabsContent value="likes" className="space-y-4 mt-6">
        {likedPosts.length === 0 ? (
          <EmptyState message="No liked posts yet" />
        ) : (
          likedPosts.map((post) => (
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
      </TabsContent>
    </Tabs>
  )
} 