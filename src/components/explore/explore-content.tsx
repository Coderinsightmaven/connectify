"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { PostCard } from "@/components/post/post-card"
import { cn } from "@/lib/utils"
import { usePostsStore } from "@/stores"

export function ExploreContent() {
  const { 
    posts, 
    trendingTopics, 
    suggestedUsers,
    isLoading,
    loadPosts,
    likePost,
    unlikePost,
    bookmarkPost,
    unbookmarkPost,
    sharePost,
    setSuggestedUsers
  } = usePostsStore()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState(suggestedUsers)

  // Load trending posts and suggested users on mount
  useEffect(() => {
    const loadData = async () => {
      // Load trending posts
      await loadPosts('trending', true)
      
      // Load suggested users from API
      try {
        const response = await fetch('/api/users/suggested')
        const data = await response.json()
        if (data.success) {
          setUsers(data.data.users)
          setSuggestedUsers(data.data.users)
        }
      } catch (error) {
        console.error('Failed to load suggested users:', error)
      }
    }
    
    loadData()
  }, [loadPosts, setSuggestedUsers])

  // Update local users when store changes
  useEffect(() => {
    setUsers(suggestedUsers)
  }, [suggestedUsers])

  // Filter trending posts (get first 10 for trending tab)
  const trendingPosts = posts.slice(0, 10)

  const toggleFollow = async (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    )
    
    // TODO: Call follow/unfollow API
    try {
      const user = users.find(u => u.id === userId)
      if (user?.isFollowing) {
        await fetch(`/api/users/${userId}/unfollow`, { method: 'POST' })
      } else {
        await fetch(`/api/users/${userId}/follow`, { method: 'POST' })
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      // Revert on error
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, isFollowing: !user.isFollowing }
            : user
        )
      )
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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

  return (
    <div>
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        {/* Trending Posts */}
        <TabsContent value="trending" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : trendingPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No trending posts available</p>
              <p className="text-sm">Check back later for trending content!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trendingPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
          
          {trendingPosts.length > 0 && (
            <div className="text-center">
              <Button variant="outline" onClick={() => loadPosts('trending', false)}>
                Load More Trending Posts
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Trending Topics */}
        <TabsContent value="topics" className="space-y-6 mt-6">
          <div className="grid gap-4">
            {trendingTopics.map((trend) => (
              <Card key={trend.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{trend.name}</h3>
                      <p className="text-muted-foreground">
                        {trend.postsCount.toLocaleString()} posts
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={trend.trend === 'up' ? 'default' : trend.trend === 'down' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {trend.trend === 'up' && '↗️ Trending'}
                        {trend.trend === 'down' && '↘️ Declining'}
                        {trend.trend === 'stable' && '➡️ Stable'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {trendingTopics.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No trending topics available</p>
              <p className="text-sm">Topics will appear here as they gain popularity!</p>
            </div>
          )}
        </TabsContent>

        {/* Suggested People */}
        <TabsContent value="people" className="space-y-6 mt-6">
          {/* Search */}
          <div className="relative">
            <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Suggested Users */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? (
                <>
                  <p className="text-lg mb-2">No users found</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </>
              ) : (
                <>
                  <p className="text-lg mb-2">No suggested users available</p>
                  <p className="text-sm">Check back later for new people to follow!</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold truncate">{user.name}</h3>
                          {user.verified && (
                            <Badge variant="default" className="bg-blue-500 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                        {user.username && (
                          <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
                        )}
                        {user.bio && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{user.bio}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {user.followersCount?.toLocaleString() || '0'} followers
                          </span>
                          <Button
                            size="sm"
                            variant={user.isFollowing ? "outline" : "default"}
                            onClick={() => toggleFollow(user.id)}
                          >
                            {user.isFollowing ? "Following" : "Follow"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 