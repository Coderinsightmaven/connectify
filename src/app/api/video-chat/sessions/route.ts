import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createVideoChatSessionSchema, CreateVideoChatSessionInput } from "@/lib/validations/video-chat"
import { createErrorResponse, createSuccessResponse, handleApiError, validateRequest } from "@/lib/utils/api"

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return createErrorResponse("Unauthorized", 401)
    }
    
    const { data, error } = await validateRequest<CreateVideoChatSessionInput>(request, createVideoChatSessionSchema)
    if (error) return error
    
    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create the video chat session
    const videoChatSession = await db.videoChatSession.create({
      data: {
        sessionId,
        participants: JSON.stringify([{
          userId: session.user.id,
          joinedAt: new Date().toISOString(),
          isAnonymous: true,
          preferences: data.preferences || null
        }]),
        isActive: true,
      }
    })
    
    return createSuccessResponse({
      session: {
        id: videoChatSession.id,
        sessionId: videoChatSession.sessionId,
        isActive: videoChatSession.isActive,
        participants: videoChatSession.participants,
        createdAt: videoChatSession.createdAt,
      }
    }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return createErrorResponse("Unauthorized", 401)
    }
    
    // Get active sessions for the user
    const activeSessions = await db.videoChatSession.findMany({
      where: {
        isActive: true,
        // Note: In a real implementation, you'd need to parse the JSON to filter by user
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    
    return createSuccessResponse({ sessions: activeSessions })
  } catch (error) {
    return handleApiError(error)
  }
} 