"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useSession } from "@/lib/auth-client"
import { useUserStore } from "@/stores"

interface User {
  id: string
  email: string
  name: string
  username?: string
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

interface Session {
  user: User
  session: {
    id: string
    userId: string
    expiresAt: Date
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt: Date
    updatedAt: Date
  }
}

interface AuthContextType {
  session: Session | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, isPending: isLoading } = useSession()
  const { setCurrentUser, convertAuthUser, currentUser } = useUserStore()
  
  // Sync session data with user store
  useEffect(() => {
    if (session?.user && !isLoading) {
      // Convert auth user to our User type and set in store
      const user = convertAuthUser(session.user)
      setCurrentUser(user)
    } else if (!session && !isLoading) {
      // Clear user data if no session
      setCurrentUser(null)
    }
  }, [session, isLoading, setCurrentUser, convertAuthUser])
  
  const contextValue: AuthContextType = {
    session: session || null,
    user: currentUser || session?.user || null,
    isLoading,
    isAuthenticated: !!session?.user
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (!isLoading && !isAuthenticated) {
    throw new Error("Authentication required")
  }
  
  return useAuth()
} 