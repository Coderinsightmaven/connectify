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
    
    // For now, return empty notifications since we don't have a notification system yet
    // In a real app, you would fetch from a notifications table
    const notifications = []
    
    return createSuccessResponse({ notifications })
  } catch (error) {
    return handleApiError(error)
  }
} 