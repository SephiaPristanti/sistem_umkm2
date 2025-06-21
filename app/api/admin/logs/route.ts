import { type NextRequest, NextResponse } from "next/server"
import { apiLogs } from "@/lib/middleware/api-logger"
import { verifyAdminToken } from "@/lib/auth/jwt-auth"

export async function GET(request: NextRequest) {
  try {
    // Get token from authorization header
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      // Verify admin token
      const decoded = verifyAdminToken(token)

      // Check if user has permission to view logs
      if (!["super_admin"].includes(decoded.role)) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      // Get query parameters
      const { searchParams } = new URL(request.url)
      const limit = Number.parseInt(searchParams.get("limit") || "100")
      const page = Number.parseInt(searchParams.get("page") || "1")
      const method = searchParams.get("method")
      const path = searchParams.get("path")

      // Filter logs
      let filteredLogs = [...apiLogs]

      if (method) {
        filteredLogs = filteredLogs.filter((log) => log.method === method)
      }

      if (path) {
        filteredLogs = filteredLogs.filter((log) => log.path.includes(path))
      }

      // Paginate logs
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

      return NextResponse.json({
        logs: paginatedLogs,
        pagination: {
          total: filteredLogs.length,
          page,
          limit,
          pages: Math.ceil(filteredLogs.length / limit),
        },
      })
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
