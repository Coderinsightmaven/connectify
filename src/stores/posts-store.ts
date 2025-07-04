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
  nextCursor: string | null
  
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
  
  // Actions - Data Loading
  loadPosts: (type?: 'home' | 'following' | 'trending', refresh?: boolean) => Promise<void>
  loadMorePosts: () => Promise<void>
  refreshPosts: () => Promise<void>
  
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
  loadBookmarkedPosts: () => Promise<void>
}

// Default trending topics
const defaultTrendingTopics: TrendingTopic[] = [
  { id: "1", name: "#WebDevelopment", postsCount: 12500, trend: "up" },
  { id: "2", name: "#AI", postsCount: 8900, trend: "up" },
  { id: "3", name: "#Design", postsCount: 5600, trend: "stable" },
  { id: "4", name: "#JavaScript", postsCount: 4200, trend: "down" },
  { id: "5", name: "#React", postsCount: 3800, trend: "up" }
]

export const usePostsStore = create<PostsState>((set, get) => ({
  // Initial state
  posts: [],
  isLoading: false,
  hasMore: true,
  nextCursor: null,
  
  currentPost: null,
  isPostLoading: false,
  
  comments: [],
  isCommentsLoading: false,
  
  trendingTopics: defaultTrendingTopics,
  suggestedUsers: [],
  
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

  // Data loading actions
  loadPosts: async (type = 'home', refresh = false) => {
    const { posts, nextCursor } = get()
    
    if (!refresh && posts.length > 0) return
    
    set({ isLoading: true })
    
    try {
      const params = new URLSearchParams({
        type,
        limit: '10',
        ...(refresh ? {} : { cursor: nextCursor || '' })
      })
      
      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()
      
      if (data.success) {
        const newPosts = data.data.posts.map((post: any) => ({
          ...post,
          isShared: false, // Default value since not in API
        }))
        
        set({
          posts: refresh ? newPosts : [...posts, ...newPosts],
          nextCursor: data.data.nextCursor,
          hasMore: !!data.data.nextCursor,
          isLoading: false
        })
      } else {
        console.error('Failed to load posts:', data.error)
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Error loading posts:', error)
      set({ isLoading: false })
    }
  },

  loadMorePosts: async () => {
    const { hasMore, isLoading } = get()
    if (!hasMore || isLoading) return
    
    await get().loadPosts('home', false)
  },

  refreshPosts: async () => {
    set({ nextCursor: null, hasMore: true })
    await get().loadPosts('home', true)
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
      
      // TODO: Call API to like post
      fetch(`/api/posts/${postId}/like`, { method: 'POST' })
        .catch(error => {
          console.error('Failed to like post:', error)
          // Revert on error
          updatePost(postId, {
            isLiked: false,
            likesCount: Math.max(0, post.likesCount)
          })
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
      
      // TODO: Call API to unlike post
      fetch(`/api/posts/${postId}/like`, { method: 'DELETE' })
        .catch(error => {
          console.error('Failed to unlike post:', error)
          // Revert on error
          updatePost(postId, {
            isLiked: true,
            likesCount: post.likesCount + 1
          })
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
      
      // TODO: Call API to bookmark post
      fetch(`/api/posts/${postId}/bookmark`, { method: 'POST' })
        .catch(error => {
          console.error('Failed to bookmark post:', error)
          // Revert on error
          updatePost(postId, { isBookmarked: false })
          set({
            bookmarkedPosts: bookmarkedPosts.filter(p => p.id !== postId)
          })
        })
    }
  },
  
  unbookmarkPost: (postId: string) => {
    const { updatePost, bookmarkedPosts } = get()
    updatePost(postId, { isBookmarked: false })
    set({
      bookmarkedPosts: bookmarkedPosts.filter(post => post.id !== postId)
    })
    
    // TODO: Call API to unbookmark post
    fetch(`/api/posts/${postId}/bookmark`, { method: 'DELETE' })
      .catch(error => {
        console.error('Failed to unbookmark post:', error)
        // Revert on error
        updatePost(postId, { isBookmarked: true })
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
      
      // TODO: Call API to share post
      fetch(`/api/posts/${postId}/share`, { method: 'POST' })
        .catch(error => {
          console.error('Failed to share post:', error)
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
  },

  loadBookmarkedPosts: async () => {
    set({ isLoading: true })
    
    try {
      // TODO: Create bookmarks API endpoint
      const response = await fetch('/api/bookmarks')
      const data = await response.json()
      
      if (data.success) {
        set({
          bookmarkedPosts: data.data.posts,
          isLoading: false
        })
      } else {
        console.error('Failed to load bookmarked posts:', data.error)
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Error loading bookmarked posts:', error)
      set({ isLoading: false })
    }
  }
})) 