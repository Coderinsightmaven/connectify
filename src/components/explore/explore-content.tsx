"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { PostCard } from "@/components/post/post-card"
import { cn } from "@/lib/utils"

import { PLACEHOLDER_AVATAR, PLACEHOLDER_POST_IMAGE } from "@/lib/placeholders"
// Mock data for trending posts
const trendingPosts = [
  {
    id: "1",
    author: {
      name: "Tech News",
      username: "technews",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "🚀 Breaking: AI breakthrough in natural language processing! New model achieves 95% accuracy in real-world scenarios. This could revolutionize how we interact with technology. #AI #TechNews",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 1240,
    comments: 89,
    shares: 156,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: "2",
    author: {
      name: "Design Inspiration",
      username: "designinspo",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "Beautiful minimalist workspace setup that sparks creativity ✨ Sometimes less is more when it comes to productivity.",
    image: PLACEHOLDER_POST_IMAGE,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 856,
    comments: 45,
    shares: 67,
    isLiked: true,
    isBookmarked: false
  }
]

// Mock trending topics
const trendingTopics = [
  { name: "#TechTrends", posts: "45.2K posts", growth: "+15%" },
  { name: "#WebDev", posts: "32.1K posts", growth: "+8%" },
  { name: "#DesignInspiration", posts: "28.7K posts", growth: "+12%" },
  { name: "#StartupLife", posts: "19.4K posts", growth: "+22%" },
  { name: "#RemoteWork", posts: "15.9K posts", growth: "+5%" },
  { name: "#Innovation", posts: "12.3K posts", growth: "+18%" }
]

// Mock suggested users
const suggestedUsers = [
  {
    id: "1",
    name: "Sarah Martinez",
    username: "sarahm_dev",
    avatar: PLACEHOLDER_AVATAR,
    bio: "Full-stack developer • React enthusiast • Coffee lover",
    followers: "12.4K",
    isFollowing: false
  },
  {
    id: "2", 
    name: "David Chen",
    username: "davidc_design",
    avatar: PLACEHOLDER_AVATAR,
    bio: "UI/UX Designer • Creating beautiful digital experiences",
    followers: "8.7K",
    isFollowing: false
  },
  {
    id: "3",
    name: "Emma Thompson",
    username: "emmathompson",
    avatar: PLACEHOLDER_AVATAR, 
    bio: "Tech journalist • Covering the latest in AI and robotics",
    followers: "25.1K",
    isFollowing: true
  },
  {
    id: "4",
    name: "Marcus Johnson",
    username: "marcusj_code",
    avatar: PLACEHOLDER_AVATAR,
    bio: "Senior Engineer @ TechCorp • Open source contributor",
    followers: "15.8K",
    isFollowing: false
  }
]

export function ExploreContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState(suggestedUsers)

  const toggleFollow = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    )
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <div className="space-y-4">
            {trendingPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline">Load More Trending Posts</Button>
          </div>
        </TabsContent>

        {/* Trending Topics */}
        <TabsContent value="topics" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {trendingTopics.map((topic, index) => (
              <Card key={topic.name} className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{topic.name}</h3>
                    <Badge variant="secondary" className="text-green-600">
                      {topic.growth}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {topic.posts} • Trending in Technology
                  </p>
                  <div className="mt-3 flex items-center text-xs text-muted-foreground">
                    <Icons.user className="h-3 w-3 mr-1" />
                    Trending #{index + 1} in your area
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* People to Follow */}
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
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">{user.name}</h3>
                        <Button
                          size="sm"
                          variant={user.isFollowing ? "outline" : "default"}
                          onClick={() => toggleFollow(user.id)}
                          className="ml-2"
                        >
                          {user.isFollowing ? "Following" : "Follow"}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{user.bio}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Icons.user className="h-3 w-3 mr-1" />
                        {user.followers} followers
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Icons.user className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">No users found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 