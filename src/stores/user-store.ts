import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio?: string
  location?: string
  website?: string
  followersCount: number
  followingCount: number
  postsCount: number
  verified: boolean
  joinDate: string
}

interface UserState {
  // User data
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Profile data
  profile: User | null
  isProfileLoading: boolean
  
  // Following/followers
  following: User[]
  followers: User[]
  
  // Actions
  login: (user: User) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  setProfile: (user: User | null) => void
  followUser: (user: User) => void
  unfollowUser: (userId: string) => void
  setFollowing: (users: User[]) => void
  setFollowers: (users: User[]) => void
  setLoading: (loading: boolean) => void
  setProfileLoading: (loading: boolean) => void
}

// Mock current user data
const mockCurrentUser: User = {
  id: "1",
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john&backgroundColor=b6e3f4",
  bio: "Software developer passionate about creating amazing user experiences. Love coffee and coding!",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  followersCount: 1234,
  followingCount: 567,
  postsCount: 89,
  verified: true,
  joinDate: "2020-01-15"
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: mockCurrentUser, // In real app, this would be null initially
      isAuthenticated: true, // In real app, this would be false initially
      isLoading: false,
      
      profile: null,
      isProfileLoading: false,
      
      following: [],
      followers: [],
      
      // Actions
      login: (user: User) => {
        set({
          currentUser: user,
          isAuthenticated: true,
          isLoading: false
        })
      },
      
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          profile: null,
          following: [],
          followers: []
        })
      },
      
      updateProfile: (updates: Partial<User>) => {
        const { currentUser } = get()
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates }
          set({
            currentUser: updatedUser
          })
        }
      },
      
      setProfile: (user: User | null) => {
        set({ profile: user, isProfileLoading: false })
      },
      
      followUser: (user: User) => {
        const { following, currentUser } = get()
        if (!following.find(u => u.id === user.id)) {
          set({
            following: [...following, user]
          })
          
          // Update current user's following count
          if (currentUser) {
            set({
              currentUser: {
                ...currentUser,
                followingCount: currentUser.followingCount + 1
              }
            })
          }
        }
      },
      
      unfollowUser: (userId: string) => {
        const { following, currentUser } = get()
        set({
          following: following.filter(u => u.id !== userId)
        })
        
        // Update current user's following count
        if (currentUser) {
          set({
            currentUser: {
              ...currentUser,
              followingCount: Math.max(0, currentUser.followingCount - 1)
            }
          })
        }
      },
      
      setFollowing: (users: User[]) => {
        set({ following: users })
      },
      
      setFollowers: (users: User[]) => {
        set({ followers: users })
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      setProfileLoading: (loading: boolean) => {
        set({ isProfileLoading: loading })
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        following: state.following
      })
    }
  )
) 