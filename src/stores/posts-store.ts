import { create } from 'zustand'
import { User } from './user-store'

export interface Comment {
  id: string
  postId: string
  author: User
  content: string
  createdAt: string
  likesCount: number
  isLiked: boolean
}

export interface Post {
  id: string
  author: User
  content: string
  images?: string[]
  createdAt: string
  likesCount: number
  commentsCount: number
  sharesCount: number
  isLiked: boolean
  isBookmarked: boolean
  isShared: boolean
  comments?: Comment[]
}

export interface TrendingTopic {
  id: string
  name: string
  postsCount: number
  trend: 'up' | 'down' | 'stable'
}

interface PostsState {
  // Posts data
  posts: Post[]
  isLoading: boolean
  hasMore: boolean
  
  // Individual post
  currentPost: Post | null
  isPostLoading: boolean
  
  // Comments
  comments: Comment[]
  isCommentsLoading: boolean
  
  // Trending & Discovery
  trendingTopics: TrendingTopic[]
  suggestedUsers: User[]
  
  // Bookmarks
  bookmarkedPosts: Post[]
  
  // Search
  searchResults: Post[]
  isSearching: boolean
  
  // Actions - Posts
  setPosts: (posts: Post[]) => void
  addPost: (post: Post) => void
  updatePost: (postId: string, updates: Partial<Post>) => void
  deletePost: (postId: string) => void
  setCurrentPost: (post: Post | null) => void
  setLoading: (loading: boolean) => void
  setPostLoading: (loading: boolean) => void
  
  // Actions - Interactions
  likePost: (postId: string) => void
  unlikePost: (postId: string) => void
  bookmarkPost: (postId: string) => void
  unbookmarkPost: (postId: string) => void
  sharePost: (postId: string) => void
  
  // Actions - Comments
  addComment: (comment: Comment) => void
  likeComment: (commentId: string) => void
  setComments: (comments: Comment[]) => void
  setCommentsLoading: (loading: boolean) => void
  
  // Actions - Discovery
  setTrendingTopics: (topics: TrendingTopic[]) => void
  setSuggestedUsers: (users: User[]) => void
  
  // Actions - Search
  searchPosts: (query: string) => void
  setSearchResults: (results: Post[]) => void
  clearSearch: () => void
  
  // Actions - Bookmarks
  setBookmarkedPosts: (posts: Post[]) => void
}

// Mock data
const mockUsers: User[] = [
  {
    id: "2",
    name: "Sarah Wilson",
    username: "sarahw",
    email: "sarah@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=c0aede",
    bio: "Designer & coffee lover ☕",
    followersCount: 2341,
    followingCount: 432,
    postsCount: 156,
    verified: false,
    joinDate: "2021-03-10"
  },
  {
    id: "3",
    name: "Mike Chen",
    username: "mikechen",
    email: "mike@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike&backgroundColor=d1d4f9",
    bio: "Tech enthusiast & photographer 📸",
    followersCount: 890,
    followingCount: 234,
    postsCount: 67,
    verified: true,
    joinDate: "2020-11-22"
  }
]

const mockPosts: Post[] = [
  {
    id: "1",
    author: mockUsers[0],
    content: "Just finished designing a new interface for our app! Really excited about the user experience improvements we're making. The new navigation feels so much more intuitive. 🎨✨",
    images: ["https://picsum.photos/600/400?random=1"],
    createdAt: "2024-01-20T10:30:00Z",
    likesCount: 42,
    commentsCount: 8,
    sharesCount: 3,
    isLiked: false,
    isBookmarked: false,
    isShared: false
  },
  {
    id: "2",
    author: mockUsers[1],
    content: "Beautiful sunset from my rooftop garden today. Sometimes you need to step away from the screen and appreciate the simple things in life. 🌅",
    images: ["https://picsum.photos/600/400?random=2"],
    createdAt: "2024-01-20T08:15:00Z",
    likesCount: 127,
    commentsCount: 15,
    sharesCount: 7,
    isLiked: true,
    isBookmarked: true,
    isShared: false
  }
]

const mockTrendingTopics: TrendingTopic[] = [
  { id: "1", name: "#WebDevelopment", postsCount: 12500, trend: "up" },
  { id: "2", name: "#AI", postsCount: 8900, trend: "up" },
  { id: "3", name: "#Design", postsCount: 5600, trend: "stable" },
  { id: "4", name: "#JavaScript", postsCount: 4200, trend: "down" },
  { id: "5", name: "#React", postsCount: 3800, trend: "up" }
]

export const usePostsStore = create<PostsState>((set, get) => ({
  // Initial state
  posts: mockPosts,
  isLoading: false,
  hasMore: true,
  
  currentPost: null,
  isPostLoading: false,
  
  comments: [],
  isCommentsLoading: false,
  
  trendingTopics: mockTrendingTopics,
  suggestedUsers: mockUsers,
  
  bookmarkedPosts: [],
  
  searchResults: [],
  isSearching: false,
  
  // Posts actions
  setPosts: (posts: Post[]) => {
    set({ posts })
  },
  
  addPost: (post: Post) => {
    const { posts } = get()
    set({ posts: [post, ...posts] })
  },
  
  updatePost: (postId: string, updates: Partial<Post>) => {
    const { posts } = get()
    set({
      posts: posts.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    })
  },
  
  deletePost: (postId: string) => {
    const { posts } = get()
    set({
      posts: posts.filter(post => post.id !== postId)
    })
  },
  
  setCurrentPost: (post: Post | null) => {
    set({ currentPost: post })
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },
  
  setPostLoading: (loading: boolean) => {
    set({ isPostLoading: loading })
  },
  
  // Interaction actions
  likePost: (postId: string) => {
    const { posts, updatePost } = get()
    const post = posts.find(p => p.id === postId)
    if (post && !post.isLiked) {
      updatePost(postId, {
        isLiked: true,
        likesCount: post.likesCount + 1
      })
    }
  },
  
  unlikePost: (postId: string) => {
    const { posts, updatePost } = get()
    const post = posts.find(p => p.id === postId)
    if (post && post.isLiked) {
      updatePost(postId, {
        isLiked: false,
        likesCount: Math.max(0, post.likesCount - 1)
      })
    }
  },
  
  bookmarkPost: (postId: string) => {
    const { posts, updatePost, bookmarkedPosts } = get()
    const post = posts.find(p => p.id === postId)
    if (post && !post.isBookmarked) {
      updatePost(postId, { isBookmarked: true })
      set({
        bookmarkedPosts: [post, ...bookmarkedPosts]
      })
    }
  },
  
  unbookmarkPost: (postId: string) => {
    const { updatePost, bookmarkedPosts } = get()
    updatePost(postId, { isBookmarked: false })
    set({
      bookmarkedPosts: bookmarkedPosts.filter(post => post.id !== postId)
    })
  },
  
  sharePost: (postId: string) => {
    const { posts, updatePost } = get()
    const post = posts.find(p => p.id === postId)
    if (post) {
      updatePost(postId, {
        isShared: true,
        sharesCount: post.sharesCount + 1
      })
    }
  },
  
  // Comments actions
  addComment: (comment: Comment) => {
    const { comments, updatePost } = get()
    set({ comments: [comment, ...comments] })
    
    // Update post comment count
    updatePost(comment.postId, {
      commentsCount: comments.length + 1
    })
  },
  
  likeComment: (commentId: string) => {
    const { comments } = get()
    set({
      comments: comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likesCount: comment.isLiked 
                ? Math.max(0, comment.likesCount - 1)
                : comment.likesCount + 1
            }
          : comment
      )
    })
  },
  
  setComments: (comments: Comment[]) => {
    set({ comments })
  },
  
  setCommentsLoading: (loading: boolean) => {
    set({ isCommentsLoading: loading })
  },
  
  // Discovery actions
  setTrendingTopics: (topics: TrendingTopic[]) => {
    set({ trendingTopics: topics })
  },
  
  setSuggestedUsers: (users: User[]) => {
    set({ suggestedUsers: users })
  },
  
  // Search actions
  searchPosts: (query: string) => {
    const { posts } = get()
    set({ isSearching: true })
    
    // Simulate search delay
    setTimeout(() => {
      const results = posts.filter(post =>
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.author.name.toLowerCase().includes(query.toLowerCase())
      )
      set({
        searchResults: results,
        isSearching: false
      })
    }, 500)
  },
  
  setSearchResults: (results: Post[]) => {
    set({ searchResults: results })
  },
  
  clearSearch: () => {
    set({
      searchResults: [],
      isSearching: false
    })
  },
  
  // Bookmarks actions
  setBookmarkedPosts: (posts: Post[]) => {
    set({ bookmarkedPosts: posts })
  }
})) 