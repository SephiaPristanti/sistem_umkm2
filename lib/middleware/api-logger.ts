import { type NextRequest, NextResponse } from "next/server"

// Interface for log entry
export interface ApiLogEntry {
  timestamp: string
  method: string
  path: string
  query: Record<string, string>
  ip: string | null
  userAgent: string | null
  responseTime?: number
  statusCode?: number
  error?: string
}

// In-memory log storage (for demo purposes)
// In production, you would use a database or logging service
export const apiLogs: ApiLogEntry[] = []

// Maximum number of logs to keep in memory
const MAX_LOGS = 1000

/**
 * Log API request and response
 */
export async function logApiRequest(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
): Promise<NextResponse> {
  const startTime = Date.now()
  const { pathname, searchParams } = request.nextUrl

  // Create query params object
  const query: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    query[key] = value
  })

  // Create initial log entry
  const logEntry: ApiLogEntry = {
    timestamp: new Date().toISOString(),
    method: request.method,
    path: pathname,
    query,
    ip: request.ip || request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent") || null,
  }

  try {
    // Execute the original handler
    const response = await handler(request)

    // Complete the log entry with response data
    logEntry.responseTime = Date.now() - startTime
    logEntry.statusCode = response.status

    // Store the log
    storeLog(logEntry)

    // Add custom header with request ID for tracking
    const requestId = crypto.randomUUID()
    response.headers.set("x-request-id", requestId)

    return response
  } catch (error: any) {
    // Log error
    logEntry.responseTime = Date.now() - startTime
    logEntry.statusCode = 500
    logEntry.error = error.message || "Unknown error"

    // Store the log
    storeLog(logEntry)

    // Return error response
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}

/**
 * Store log entry
 */
function storeLog(logEntry: ApiLogEntry): void {
  // Add to in-memory logs
  apiLogs.unshift(logEntry)

  // Trim logs if exceeding maximum
  if (apiLogs.length > MAX_LOGS) {
    apiLogs.length = MAX_LOGS
  }

  // Log to console
  console.log(
    `[API] ${logEntry.timestamp} | ${logEntry.method} ${logEntry.path} | ` +
      `${logEntry.statusCode || "?"} | ${logEntry.responseTime || "?"}ms` +
      (logEntry.error ? ` | Error: ${logEntry.error}` : ""),
  )
}
