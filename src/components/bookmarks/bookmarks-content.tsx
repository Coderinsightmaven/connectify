"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { PostCard } from "@/components/post/post-card"
import { cn } from "@/lib/utils"
import { usePostsStore } from "@/stores"

export function BookmarksContent() {
  const { 
    bookmarkedPosts, 
    isLoading,
    loadBookmarkedPosts,
    likePost,
    unlikePost,
    bookmarkPost,
    unbookmarkPost,
    sharePost
  } = usePostsStore()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "bookmarked">("bookmarked")

  // Load bookmarked posts on mount
  useEffect(() => {
    loadBookmarkedPosts()
  }, [loadBookmarkedPosts])

  // Get all unique tags from bookmarked posts
  const allTags = Array.from(new Set(
    bookmarkedPosts.flatMap(post => {
      // Extract hashtags from post content
      const hashtags = post.content.match(/#\w+/g) || []
      return hashtags.map(tag => tag.toLowerCase())
    })
  ))

  // Filter posts based on search and tags
  const filteredPosts = bookmarkedPosts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author.username && post.author.username.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const postTags = post.content.match(/#\w+/g)?.map(tag => tag.toLowerCase()) || []
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => postTags.includes(tag))
    
    return matchesSearch && matchesTags
  })

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "bookmarked":
        // Sort by when they were bookmarked (most recent first)
        // Since we don't have bookmarkedAt timestamp, use createdAt as fallback
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  const handleLike = (postId: string) => {
    const post = bookmarkedPosts.find(p => p.id === postId)
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
    const post = bookmarkedPosts.find(p => p.id === postId)
    if (post?.isBookmarked) {
      unbookmarkPost(postId)
    } else {
      bookmarkPost(postId)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSortBy("bookmarked")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookmarked posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "oldest" | "bookmarked")}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="bookmarked">Recently Bookmarked</option>
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {(searchQuery || selectedTags.length > 0 || sortBy !== "bookmarked") && (
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Filter by tags:</span>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {sortedPosts.length} of {bookmarkedPosts.length} bookmarked posts
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
        </span>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            {bookmarkedPosts.length === 0 ? (
              <div className="text-muted-foreground">
                <Icons.bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No bookmarked posts yet</p>
                <p className="text-sm">
                  Start bookmarking posts you want to save for later!
                </p>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <p className="text-lg font-medium mb-2">No posts match your filters</p>
                <p className="text-sm">Try adjusting your search or removing some filters.</p>
                <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          sortedPosts.map((post) => (
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
  )
} 