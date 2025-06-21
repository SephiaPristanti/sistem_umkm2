import type { NextRequest, NextResponse } from "next/server"
import { logApiRequest } from "./api-logger"

/**
 * Higher-order function to wrap API handlers with logging
 */
export function withLogging(handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) {
  return (request: NextRequest) => logApiRequest(request, handler)
}
