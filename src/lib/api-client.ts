import { getSession } from "./auth-client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

class ApiClient {
  private async getHeaders(): Promise<HeadersInit> {
    const session = await getSession()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    
    // Better-Auth handles authentication via cookies, not tokens
    // No need to manually add Authorization header
    
    return headers
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "GET",
      headers: await this.getHeaders(),
      credentials: "include", // Include cookies for Better-Auth
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: await this.getHeaders(),
      credentials: "include", // Include cookies for Better-Auth
      body: data ? JSON.stringify(data) : undefined,
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: await this.getHeaders(),
      credentials: "include", // Include cookies for Better-Auth
      body: data ? JSON.stringify(data) : undefined,
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
      headers: await this.getHeaders(),
      credentials: "include", // Include cookies for Better-Auth
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }
}

export const apiClient = new ApiClient()

// Specific API methods
export const api = {
  // Posts
  getPosts: (params?: { type?: string; limit?: number; cursor?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.type) searchParams.set("type", params.type)
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.cursor) searchParams.set("cursor", params.cursor)
    
    return apiClient.get(`/api/posts?${searchParams.toString()}`)
  },
  
  createPost: (data: { content: string; images?: string[] }) =>
    apiClient.post("/api/posts", data),
  
  likePost: (postId: string) =>
    apiClient.post(`/api/posts/${postId}/like`),
  
  bookmarkPost: (postId: string) =>
    apiClient.post(`/api/posts/${postId}/bookmark`),

  // Users
  getUsers: (params?: { search?: string; limit?: number; filter?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set("search", params.search)
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.filter) searchParams.set("filter", params.filter)
    
    return apiClient.get(`/api/users?${searchParams.toString()}`)
  },
  
  getUser: (userId: string) =>
    apiClient.get(`/api/users/${userId}`),
  
  updateProfile: (data: any) =>
    apiClient.put("/api/users", data),
  
  followUser: (userId: string) =>
    apiClient.post(`/api/users/${userId}/follow`),

  // Search
  search: (params: { query: string; type?: string; limit?: number }) => {
    const searchParams = new URLSearchParams()
    searchParams.set("query", params.query)
    if (params.type) searchParams.set("type", params.type)
    if (params.limit) searchParams.set("limit", params.limit.toString())
    
    return apiClient.get(`/api/search?${searchParams.toString()}`)
  },

  // Trending
  getTrending: () =>
    apiClient.get("/api/trending"),

  // Video Chat
  createVideoSession: (data?: any) =>
    apiClient.post("/api/video-chat/sessions", data),
  
  getVideoSessions: () =>
    apiClient.get("/api/video-chat/sessions"),
} 