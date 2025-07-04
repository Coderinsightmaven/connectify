import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createErrorResponse, createSuccessResponse, handleApiError } from "@/lib/utils/api"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    const currentUserId = session?.user?.id
    
    const user = await db.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: currentUserId === params.id, // Only show email to the user themselves
        avatar: true,
        bio: true,
        location: true,
        website: true,
        isVerified: true,
        followerCount: true,
        followingCount: true,
        postCount: true,
        createdAt: true,
        followers: currentUserId ? {
          where: { followerId: currentUserId },
          select: { id: true }
        } : false,
      },
    })
    
    if (!user) {
      return createErrorResponse("User not found", 404)
    }
    
    // Add isFollowing field based on the followers relation
    const userWithFollowStatus = {
      ...user,
      isFollowing: currentUserId ? user.followers.length > 0 : false,
      followers: undefined, // Remove the followers array from response
    }
    
    return createSuccessResponse({ user: userWithFollowStatus })
  } catch (error) {
    return handleApiError(error)
  }
} 