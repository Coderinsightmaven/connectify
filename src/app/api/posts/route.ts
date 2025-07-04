import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createPostSchema, feedSchema, CreatePostInput, FeedInput } from "@/lib/validations/posts"
import { createErrorResponse, createSuccessResponse, handleApiError, validateRequest } from "@/lib/utils/api"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    const currentUserId = session?.user?.id
    
    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())
    
    // Convert and validate parameters
    const parsedParams = {
      ...searchParams,
      limit: searchParams.limit ? parseInt(searchParams.limit) : undefined,
    }
    
    const validatedParams = feedSchema.parse(parsedParams)
    
    let whereClause: any = { published: true }
    let orderBy: any = { createdAt: 'desc' }
    
    // Different feed types
    if (validatedParams.type === 'following' && currentUserId) {
      // Get posts from users the current user follows
      const following = await db.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true }
      })
      
      const followingIds = following.map(f => f.followingId)
      followingIds.push(currentUserId) // Include user's own posts
      
      whereClause.authorId = { in: followingIds }
    } else if (validatedParams.type === 'trending') {
      // Order by engagement (likes + comments + shares)
      orderBy = [
        { likesCount: 'desc' },
        { commentsCount: 'desc' },
        { sharesCount: 'desc' },
        { createdAt: 'desc' }
      ]
    }
    
    // Cursor-based pagination
    if (validatedParams.cursor) {
      whereClause.id = { lt: validatedParams.cursor }
    }
    
    const posts = await db.post.findMany({
      where: whereClause,
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
        likes: currentUserId ? {
          where: { userId: currentUserId },
          select: { id: true }
        } : false,
        bookmarks: currentUserId ? {
          where: { userId: currentUserId },
          select: { id: true }
        } : false,
        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
            shares: true,
          }
        }
      },
      orderBy,
      take: validatedParams.limit,
    })
    
    // Transform posts to include user interaction status
    const transformedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      images: post.images,
      author: post.author,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      sharesCount: post._count.shares,
      bookmarksCount: post._count.bookmarks,
      isLiked: currentUserId ? post.likes.length > 0 : false,
      isBookmarked: currentUserId ? post.bookmarks.length > 0 : false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }))
    
    return createSuccessResponse({ 
      posts: transformedPosts,
      nextCursor: posts.length === validatedParams.limit ? posts[posts.length - 1]?.id : null
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return createErrorResponse("Unauthorized", 401)
    }
    
    const { data, error } = await validateRequest<CreatePostInput>(request, createPostSchema)
    if (error) return error
    
    const post = await db.$transaction(async (tx) => {
      // Create the post
      const newPost = await tx.post.create({
        data: {
          content: data.content,
          images: data.images || undefined,
          authorId: session.user.id,
        },
      })
      
      // Update user's post count
      await tx.user.update({
        where: { id: session.user.id },
        data: { postCount: { increment: 1 } }
      })
      
      // Get the complete post with author info
      const completePost = await tx.post.findUnique({
        where: { id: newPost.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              isVerified: true,
            }
          }
        }
      })
      
      return completePost
    })
    
    if (!post) {
      return createErrorResponse("Failed to create post", 500)
    }
    
    // Transform the response
    const transformedPost = {
      id: post.id,
      content: post.content,
      images: post.images,
      author: post.author,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      bookmarksCount: 0,
      isLiked: false,
      isBookmarked: false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
    
    return createSuccessResponse({ post: transformedPost }, 201)
  } catch (error) {
    return handleApiError(error)
  }
} 