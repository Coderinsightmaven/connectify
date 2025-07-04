import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createErrorResponse, createSuccessResponse, handleApiError } from "@/lib/utils/api"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return createErrorResponse("Unauthorized", 401)
    }
    
    const followerId = session.user.id
    const followingId = params.id
    
    if (followerId === followingId) {
      return createErrorResponse("Cannot follow yourself", 400)
    }
    
    // Check if the user exists
    const userToFollow = await db.user.findUnique({
      where: { id: followingId },
      select: { id: true }
    })
    
    if (!userToFollow) {
      return createErrorResponse("User not found", 404)
    }
    
    // Check if already following
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        }
      }
    })
    
    if (existingFollow) {
      // Unfollow
      await db.$transaction([
        db.follow.delete({
          where: { id: existingFollow.id }
        }),
        db.user.update({
          where: { id: followerId },
          data: { followingCount: { decrement: 1 } }
        }),
        db.user.update({
          where: { id: followingId },
          data: { followerCount: { decrement: 1 } }
        })
      ])
      
      return createSuccessResponse({ 
        message: "Unfollowed successfully",
        isFollowing: false 
      })
    } else {
      // Follow
      await db.$transaction([
        db.follow.create({
          data: {
            followerId,
            followingId,
          }
        }),
        db.user.update({
          where: { id: followerId },
          data: { followingCount: { increment: 1 } }
        }),
        db.user.update({
          where: { id: followingId },
          data: { followerCount: { increment: 1 } }
        })
      ])
      
      return createSuccessResponse({ 
        message: "Followed successfully",
        isFollowing: true 
      })
    }
  } catch (error) {
    return handleApiError(error)
  }
} 