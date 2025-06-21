import { type NextRequest, NextResponse } from "next/server"
import { generateCSRFTokenForSession } from "@/lib/middleware/csrf-protection"

export async function GET(request: NextRequest) {
  try {
    const { token, sessionId } = await generateCSRFTokenForSession(request)

    const response = NextResponse.json({ csrfToken: token })

    // Set session ID cookie if not exists
    if (!request.cookies.get("session_id")) {
      response.cookies.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      })
    }

    return response
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate CSRF token" }, { status: 500 })
  }
}
