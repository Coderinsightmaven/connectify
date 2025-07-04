import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  username?: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  followersCount: number
  followingCount: number
  postsCount: number
  verified: boolean
  joinDate: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  isFollowing?: boolean // For suggested users
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
  setCurrentUser: (user: User | null) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  setProfile: (user: User | null) => void
  followUser: (user: User) => void
  unfollowUser: (userId: string) => void
  setFollowing: (users: User[]) => void
  setFollowers: (users: User[]) => void
  setLoading: (loading: boolean) => void
  setProfileLoading: (loading: boolean) => void
  // Utility function to convert auth session user to our User type
  convertAuthUser: (authUser: any) => User
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      
      profile: null,
      isProfileLoading: false,
      
      following: [],
      followers: [],
      
      // Actions
      setCurrentUser: (user: User | null) => {
        set({
          currentUser: user,
          isAuthenticated: !!user,
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
      },

      // Utility function to convert auth session user to our User type
      convertAuthUser: (authUser: any): User => {
        return {
          id: authUser.id,
          name: authUser.name || 'Unknown User',
          username: authUser.username || authUser.email?.split('@')[0],
          email: authUser.email,
          avatar: authUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}&backgroundColor=b6e3f4`,
          bio: authUser.bio || '',
          location: authUser.location || '',
          website: authUser.website || '',
          followersCount: authUser.followersCount || 0,
          followingCount: authUser.followingCount || 0,
          postsCount: authUser.postsCount || 0,
          verified: authUser.verified || false,
          joinDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          emailVerified: authUser.emailVerified || false,
          createdAt: authUser.createdAt ? new Date(authUser.createdAt) : new Date(),
          updatedAt: authUser.updatedAt ? new Date(authUser.updatedAt) : new Date()
        }
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