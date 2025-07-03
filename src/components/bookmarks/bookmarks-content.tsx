"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { PostCard } from "@/components/post/post-card"
import { cn } from "@/lib/utils"

import { PLACEHOLDER_AVATAR, PLACEHOLDER_POST_IMAGE } from "@/lib/placeholders"
// Mock bookmarked posts data
const mockBookmarkedPosts = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      username: "sarahc",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "Just discovered this amazing CSS trick for creating responsive layouts without media queries! 🎨 Using container queries is a game-changer for component-based design.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 156,
    comments: 23,
    shares: 15,
    isLiked: true,
    isBookmarked: true,
    bookmarkedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // Bookmarked 1 hour ago
    tags: ["css", "web-dev", "responsive"]
  },
  {
    id: "2",
    author: {
      name: "Alex Rivera",
      username: "alexr",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "Building a React component library from scratch taught me so much about API design and developer experience. Here are my top 5 lessons learned...",
    image: PLACEHOLDER_POST_IMAGE,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    likes: 89,
    comments: 12,
    shares: 7,
    isLiked: false,
    isBookmarked: true,
    bookmarkedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // Bookmarked 12 hours ago
    tags: ["react", "components", "library"]
  },
  {
    id: "3",
    author: {
      name: "Emily Johnson",
      username: "emilyj",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "TypeScript 5.0 features that will change how you write code. The new decorators syntax is particularly exciting! 🚀",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    likes: 234,
    comments: 45,
    shares: 28,
    isLiked: true,
    isBookmarked: true,
    bookmarkedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Bookmarked 2 days ago
    tags: ["typescript", "programming", "updates"]
  },
  {
    id: "4",
    author: {
      name: "Michael Brown",
      username: "mikeb",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "The future of web development: Why edge computing and serverless functions are reshaping how we build applications.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    likes: 167,
    comments: 31,
    shares: 19,
    isLiked: false,
    isBookmarked: true,
    bookmarkedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // Bookmarked 4 days ago
    tags: ["serverless", "edge-computing", "future"]
  },
  {
    id: "5",
    author: {
      name: "Lisa Wang",
      username: "lisaw",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "Design systems are more than just component libraries. They're about creating consistent experiences and enabling teams to move faster.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    likes: 278,
    comments: 52,
    shares: 41,
    isLiked: true,
    isBookmarked: true,
    bookmarkedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // Bookmarked 6 days ago
    tags: ["design-systems", "ux", "teams"]
  }
]

export function BookmarksContent() {
  const [posts, setPosts] = useState(mockBookmarkedPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "bookmarked">("bookmarked")

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])))

  // Filter posts based on search and tags
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => post.tags?.includes(tag))
    
    return matchesSearch && matchesTags
  })

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return b.timestamp.getTime() - a.timestamp.getTime()
      case "oldest":
        return a.timestamp.getTime() - b.timestamp.getTime()
      case "bookmarked":
        return b.bookmarkedAt!.getTime() - a.bookmarkedAt!.getTime()
      default:
        return 0
    }
  })

  const handleRemoveBookmark = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
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

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
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

            {/* Tags Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by tags:</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="h-7 text-xs"
                  >
                    #{tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-sm border border-input bg-background px-2 py-1 rounded"
                >
                  <option value="bookmarked">Recently bookmarked</option>
                  <option value="recent">Most recent</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                {(searchQuery || selectedTags.length > 0 || sortBy !== "bookmarked") && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Clear filters
                  </Button>
                )}
                <span className="text-sm text-muted-foreground">
                  {sortedPosts.length} post{sortedPosts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Icons.bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {posts.length === 0 ? "No bookmarks yet" : "No posts match your filters"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {posts.length === 0 
                  ? "Save posts you want to read later by clicking the bookmark icon"
                  : "Try adjusting your search terms or removing some filters"
                }
              </p>
              {posts.length > 0 && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          sortedPosts.map((post) => (
            <div key={post.id} className="relative group">
              <PostCard 
                post={post} 
                onBookmark={() => handleRemoveBookmark(post.id)}
              />
              
              {/* Quick Actions Overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRemoveBookmark(post.id)}
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <Icons.bookmark className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 px-4 pb-2">
                  {post.tags.map(tag => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {sortedPosts.length > 0 && sortedPosts.length >= 5 && (
        <div className="text-center">
          <Button variant="outline">
            Load more bookmarks
          </Button>
        </div>
      )}
    </div>
  )
} 