import { NextResponse } from "next/server"
import { ZodError } from "zod"

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ZodError) {
    return createErrorResponse(
      `Validation error: ${error.errors.map(e => e.message).join(", ")}`,
      400
    )
  }

  if (error instanceof Error) {
    return createErrorResponse(error.message, 500)
  }

  return createErrorResponse("An unexpected error occurred", 500)
}

export async function validateRequest<T>(
  request: Request,
  schema: any
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { data, error: null }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        data: null,
        error: createErrorResponse(
          `Validation error: ${error.errors.map(e => e.message).join(", ")}`,
          400
        )
      }
    }
    return {
      data: null,
      error: createErrorResponse("Invalid request body", 400)
    }
  }
}

export function getSearchParams(url: string) {
  return new URL(url).searchParams
} 