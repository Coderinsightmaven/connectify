"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post/post-card"

import { PLACEHOLDER_AVATAR, PLACEHOLDER_POST_IMAGE } from "@/lib/placeholders"
// Mock posts data
const userPosts = [
  {
    id: "1",
    author: {
      name: "John Doe",
      username: "johndoe",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "Just shipped a new feature! The responsive design looks amazing on all devices. Really happy with how this turned out. 🚀",
    image: PLACEHOLDER_POST_IMAGE,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 24,
    comments: 5,
    shares: 2,
    isLiked: true,
    isBookmarked: false
  },
  {
    id: "2",
    author: {
      name: "John Doe",
      username: "johndoe",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "Beautiful sunset from my office window today. Sometimes you need to pause and appreciate the little things in life. 🌅",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    likes: 89,
    comments: 12,
    shares: 7,
    isLiked: false,
    isBookmarked: true
  },
  {
    id: "3",
    author: {
      name: "John Doe",
      username: "johndoe",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "Working on something exciting. Can't wait to share it with everyone soon! The team has been putting in amazing work. Stay tuned! 👀",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    likes: 156,
    comments: 23,
    shares: 15,
    isLiked: true,
    isBookmarked: false
  }
]

const likedPosts = [
  {
    id: "4",
    author: {
      name: "Sarah Chen",
      username: "sarahc",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "The future of web development is looking bright! Excited to see where the industry goes next.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 67,
    comments: 8,
    shares: 4,
    isLiked: true,
    isBookmarked: false
  },
  {
    id: "5",
    author: {
      name: "Alex Rivera",
      username: "alexr",
      avatar: PLACEHOLDER_AVATAR
    },
    content: "Just discovered this amazing new framework. The developer experience is incredible!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    likes: 234,
    comments: 45,
    shares: 18,
    isLiked: true,
    isBookmarked: true
  }
]

const mediaItems = [
  { id: 1, src: PLACEHOLDER_POST_IMAGE, alt: "Post image 1" },
  { id: 2, src: PLACEHOLDER_POST_IMAGE, alt: "Post image 2" },
  { id: 3, src: PLACEHOLDER_POST_IMAGE, alt: "Post image 3" },
  { id: 4, src: PLACEHOLDER_POST_IMAGE, alt: "Post image 4" },
  { id: 5, src: PLACEHOLDER_POST_IMAGE, alt: "Post image 5" },
  { id: 6, src: PLACEHOLDER_POST_IMAGE, alt: "Post image 6" },
]

export function ProfileTabs() {
  return (
    <div className="mt-8">
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4 mt-6">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {userPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-sm">When this user posts, they'll show up here.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Replies Tab */}
        <TabsContent value="replies" className="space-y-4 mt-6">
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">No replies yet</p>
              <p className="text-sm">When this user replies to posts, they'll show up here.</p>
            </div>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="mt-6">
          {mediaItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium">No media yet</p>
                <p className="text-sm">Photos and videos will appear here.</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Likes Tab */}
        <TabsContent value="likes" className="space-y-4 mt-6">
          {likedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {likedPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium">No likes yet</p>
                <p className="text-sm">When this user likes posts, they'll show up here.</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 