import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createErrorResponse, createSuccessResponse, handleApiError } from "@/lib/utils/api"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    const currentUserId = session?.user?.id
    
    // Get trending hashtags
    const trendingHashtags = await db.hashtag.findMany({
      orderBy: [
        { postCount: 'desc' },
        { updatedAt: 'desc' }
      ],
      take: 10,
    })
    
    // Get suggested users (users not followed by current user, ordered by follower count)
    let suggestedUsers = []
    if (currentUserId) {
      // Get users the current user is already following
      const following = await db.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true }
      })
      
      const followingIds = following.map(f => f.followingId)
      followingIds.push(currentUserId) // Exclude current user
      
      suggestedUsers = await db.user.findMany({
        where: {
          id: { notIn: followingIds }
        },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          isVerified: true,
          followerCount: true,
        },
        orderBy: [
          { isVerified: 'desc' },
          { followerCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 5,
      })
    } else {
      // For non-authenticated users, just show popular users
      suggestedUsers = await db.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          isVerified: true,
          followerCount: true,
        },
        orderBy: [
          { isVerified: 'desc' },
          { followerCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 5,
      })
    }
    
    return createSuccessResponse({
      hashtags: trendingHashtags,
      suggestedUsers: suggestedUsers.map(user => ({
        ...user,
        isFollowing: false, // These are users not being followed
      }))
    })
  } catch (error) {
    return handleApiError(error)
  }
} 