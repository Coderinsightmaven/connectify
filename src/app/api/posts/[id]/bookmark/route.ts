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
    
    // Check if already bookmarked
    const existingBookmark = await db.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        }
      }
    })
    
    if (existingBookmark) {
      // Remove bookmark
      await db.$transaction([
        db.bookmark.delete({
          where: { id: existingBookmark.id }
        }),
        db.post.update({
          where: { id: postId },
          data: { bookmarksCount: { decrement: 1 } }
        })
      ])
      
      return createSuccessResponse({ 
        message: "Bookmark removed successfully",
        isBookmarked: false 
      })
    } else {
      // Add bookmark
      await db.$transaction([
        db.bookmark.create({
          data: {
            userId,
            postId,
          }
        }),
        db.post.update({
          where: { id: postId },
          data: { bookmarksCount: { increment: 1 } }
        })
      ])
      
      return createSuccessResponse({ 
        message: "Post bookmarked successfully",
        isBookmarked: true 
      })
    }
  } catch (error) {
    return handleApiError(error)
  }
} 