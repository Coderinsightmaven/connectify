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
    
    const userId = session.user.id
    const postId = params.id
    
    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { id: true }
    })
    
    if (!post) {
      return createErrorResponse("Post not found", 404)
    }
    
    // Check if already liked
    const existingLike = await db.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        }
      }
    })
    
    if (existingLike) {
      // Unlike
      await db.$transaction([
        db.like.delete({
          where: { id: existingLike.id }
        }),
        db.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } }
        })
      ])
      
      return createSuccessResponse({ 
        message: "Post unliked successfully",
        isLiked: false 
      })
    } else {
      // Like
      await db.$transaction([
        db.like.create({
          data: {
            userId,
            postId,
          }
        }),
        db.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } }
        })
      ])
      
      return createSuccessResponse({ 
        message: "Post liked successfully",
        isLiked: true 
      })
    }
  } catch (error) {
    return handleApiError(error)
  }
} 