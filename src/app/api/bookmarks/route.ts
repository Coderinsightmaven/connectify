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
    
    const bookmarks = await db.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                isVerified: true,
              }
            },
            likes: {
              where: { userId: session.user.id },
              select: { id: true }
            },
            bookmarks: {
              where: { userId: session.user.id },
              select: { id: true }
            },
            _count: {
              select: {
                comments: true,
                likes: true,
                bookmarks: true,
                shares: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Transform bookmarks to posts format
    const transformedPosts = bookmarks.map(bookmark => ({
      id: bookmark.post.id,
      content: bookmark.post.content,
      images: bookmark.post.images,
      author: {
        id: bookmark.post.author.id,
        name: bookmark.post.author.name,
        username: bookmark.post.author.username,
        email: '', // Don't expose email
        avatar: bookmark.post.author.avatar,
        verified: bookmark.post.author.isVerified,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        joinDate: '',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        bio: '',
        location: '',
        website: ''
      },
      likesCount: bookmark.post._count.likes,
      commentsCount: bookmark.post._count.comments,
      sharesCount: bookmark.post._count.shares,
      isLiked: bookmark.post.likes.length > 0,
      isBookmarked: true, // Always true for bookmarked posts
      isShared: false,
      createdAt: bookmark.post.createdAt.toISOString(),
      bookmarkedAt: bookmark.createdAt.toISOString(),
    }))
    
    return createSuccessResponse({ posts: transformedPosts })
  } catch (error) {
    return handleApiError(error)
  }
} 