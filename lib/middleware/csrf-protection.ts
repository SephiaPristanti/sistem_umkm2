import { type NextRequest, NextResponse } from "next/server"
import { csrfStore, generateCSRFToken, hashCSRFToken } from "@/lib/security/csrf"

/**
 * Generate session ID from request
 */
function getSessionId(request: NextRequest): string {
  // In production, use proper session management
  const sessionCookie = request.cookies.get("session_id")?.value
  if (sessionCookie) {
    return sessionCookie
  }

  // Fallback to IP + User-Agent hash for demo
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"
  return Buffer.from(`${ip}-${userAgent}`).toString("base64")
}

/**
 * CSRF protection middleware
 */
export function withCSRFProtection(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: { methods?: string[] } = {},
) {
  const protectedMethods = options.methods || ["POST", "PUT", "DELETE", "PATCH"]

  return async (request: NextRequest): Promise<NextResponse> => {
    const method = request.method

    // Only protect specified methods
    if (!protectedMethods.includes(method)) {
      return handler(request)
    }

    const sessionId = getSessionId(request)
    const csrfToken = request.headers.get("x-csrf-token") || request.headers.get("csrf-token")

    // Verify CSRF token
    if (!csrfToken || !csrfStore.verify(sessionId, csrfToken)) {
      return NextResponse.json(
        {
          error: "CSRF token validation failed",
          code: "CSRF_TOKEN_INVALID",
        },
        { status: 403 },
      )
    }

    return handler(request)
  }
}

/**
 * Generate CSRF token for client
 */
export async function generateCSRFTokenForSession(request: NextRequest): Promise<{
  token: string
  sessionId: string
}> {
  const sessionId = getSessionId(request)
  const token = generateCSRFToken()
  const tokenHash = hashCSRFToken(token)

  csrfStore.store(sessionId, tokenHash)

  return { token, sessionId }
}
