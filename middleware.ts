import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWT } from "./lib/auth/jwt-auth"

// Paths that require admin authentication
const ADMIN_PATHS = ["/admin", "/admin/products", "/admin/users", "/admin/programs"]

// Paths that should be logged (API routes)
const API_PATHS = ["/api/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ===== JWT Validation for Admin Routes =====
  if (ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    // Get token from cookies or authorization header
    const token =
      request.cookies.get("admin_token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      // Redirect to login page if no token
      return NextResponse.redirect(new URL("/auth/login?from=" + pathname, request.url))
    }

    try {
      // Verify the token
      const decoded = verifyJWT(token)

      // Check if user is admin
      if (!["admin", "super_admin"].includes(decoded.role)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      // Continue with the request if token is valid
      const response = NextResponse.next()

      // Add user info to headers for use in the application
      response.headers.set("x-user-id", decoded.userId)
      response.headers.set("x-user-role", decoded.role)

      return response
    } catch (error) {
      // Redirect to login page if token is invalid
      return NextResponse.redirect(new URL("/auth/login?from=" + pathname, request.url))
    }
  }

  // ===== API Request Logging =====
  if (API_PATHS.some((path) => pathname.startsWith(path))) {
    // Log API request
    const requestTime = new Date().toISOString()
    const method = request.method
    console.log(`[${requestTime}] ${method} ${pathname}`)

    // Continue with the request
    const response = NextResponse.next()

    // Add response handler to log the response status
    response.headers.set("x-request-time", requestTime)

    return response
  }

  // Continue with the request for other routes
  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Admin routes
    "/admin/:path*",
    // API routes
    "/api/:path*",
  ],
}
