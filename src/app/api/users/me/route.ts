import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createErrorResponse, createSuccessResponse, handleApiError } from "@/lib/utils/api"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return createErrorResponse("Unauthorized", 401)
    }
    
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        emailVerified: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          }
        }
      }
    })
    
    if (!user) {
      return createErrorResponse("User not found", 404)
    }
    
    // Transform the user data
    const transformedUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      website: user.website,
      emailVerified: user.emailVerified,
      verified: user.isVerified,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      postsCount: user._count.posts,
      joinDate: user.createdAt.toLocaleDateString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    
    return createSuccessResponse({ user: transformedUser })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return createErrorResponse("Unauthorized", 401)
    }
    
    const body = await request.json()
    const { name, username, bio, location, website } = body
    
    // Validate username uniqueness if it's being changed
    if (username) {
      const existingUser = await db.user.findFirst({
        where: {
          username,
          NOT: { id: session.user.id }
        }
      })
      
      if (existingUser) {
        return createErrorResponse("Username already taken", 400)
      }
    }
    
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        emailVerified: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          }
        }
      }
    })
    
    // Transform the user data
    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      location: updatedUser.location,
      website: updatedUser.website,
      emailVerified: updatedUser.emailVerified,
      verified: updatedUser.isVerified,
      followersCount: updatedUser._count.followers,
      followingCount: updatedUser._count.following,
      postsCount: updatedUser._count.posts,
      joinDate: updatedUser.createdAt.toLocaleDateString(),
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    }
    
    return createSuccessResponse({ user: transformedUser })
  } catch (error) {
    return handleApiError(error)
  }
} 