import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { searchSchema, SearchInput } from "@/lib/validations/posts"
import { createErrorResponse, createSuccessResponse, handleApiError } from "@/lib/utils/api"

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
      offset: searchParams.offset ? parseInt(searchParams.offset) : undefined,
    }
    
    const validatedParams = searchSchema.parse(parsedParams)
    
    let results: any = {}
    
    if (validatedParams.type === 'posts') {
      const posts = await db.post.findMany({
        where: {
          AND: [
            { published: true },
            {
              OR: [
                { content: { contains: validatedParams.query, mode: 'insensitive' } },
              ]
            }
          ]
        },
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
        orderBy: [
          { likesCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: validatedParams.limit,
        skip: validatedParams.offset,
      })
      
      results.posts = posts.map(post => ({
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
      
    } else if (validatedParams.type === 'users') {
      const users = await db.user.findMany({
        where: {
          OR: [
            { name: { contains: validatedParams.query, mode: 'insensitive' } },
            { username: { contains: validatedParams.query, mode: 'insensitive' } },
            { bio: { contains: validatedParams.query, mode: 'insensitive' } },
          ]
        },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          isVerified: true,
          followerCount: true,
          followingCount: true,
          followers: currentUserId ? {
            where: { followerId: currentUserId },
            select: { id: true }
          } : false,
        },
        orderBy: [
          { isVerified: 'desc' },
          { followerCount: 'desc' },
        ],
        take: validatedParams.limit,
        skip: validatedParams.offset,
      })
      
      results.users = users.map(user => ({
        ...user,
        isFollowing: currentUserId ? user.followers.length > 0 : false,
        followers: undefined,
      }))
      
    } else if (validatedParams.type === 'hashtags') {
      const hashtags = await db.hashtag.findMany({
        where: {
          name: { contains: validatedParams.query, mode: 'insensitive' }
        },
        orderBy: [
          { postCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: validatedParams.limit,
        skip: validatedParams.offset,
      })
      
      results.hashtags = hashtags
    }
    
    return createSuccessResponse(results)
  } catch (error) {
    return handleApiError(error)
  }
} 