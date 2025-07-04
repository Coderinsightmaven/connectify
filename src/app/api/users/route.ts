import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { getUsersSchema, updateProfileSchema, UpdateProfileInput } from "@/lib/validations/users"
import { createErrorResponse, createSuccessResponse, handleApiError, validateRequest } from "@/lib/utils/api"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())
    
    // Convert string numbers to numbers for validation
    const parsedParams = {
      ...searchParams,
      limit: searchParams.limit ? parseInt(searchParams.limit) : undefined,
      offset: searchParams.offset ? parseInt(searchParams.offset) : undefined,
    }
    
    const validatedParams = getUsersSchema.parse(parsedParams)
    
    const whereClause: any = {}
    
    if (validatedParams.search) {
      whereClause.OR = [
        { name: { contains: validatedParams.search, mode: 'insensitive' } },
        { username: { contains: validatedParams.search, mode: 'insensitive' } },
      ]
    }
    
    if (validatedParams.filter === 'verified') {
      whereClause.isVerified = true
    }
    
    const users = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        isVerified: true,
        followerCount: true,
        followingCount: true,
        createdAt: true,
      },
      orderBy: [
        { isVerified: 'desc' },
        { followerCount: 'desc' },
        { createdAt: 'desc' }
      ],
      take: validatedParams.limit,
      skip: validatedParams.offset,
    })
    
    return createSuccessResponse({ users })
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
    
    const { data, error } = await validateRequest<UpdateProfileInput>(request, updateProfileSchema)
    if (error) return error
    
    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.username !== undefined) updateData.username = data.username
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.location !== undefined) updateData.location = data.location
    if (data.website !== undefined) updateData.website = data.website
    updateData.updatedAt = new Date()
    
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        website: true,
        isVerified: true,
        followerCount: true,
        followingCount: true,
        postCount: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    return createSuccessResponse({ user: updatedUser })
  } catch (error) {
    return handleApiError(error)
  }
} 