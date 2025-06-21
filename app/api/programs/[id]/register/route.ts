import { type NextRequest, NextResponse } from "next/server"
import { withCSRFProtection } from "@/lib/middleware/csrf-protection"
import { sanitizeFormData } from "@/lib/security/sanitization"
import { withLogging } from "@/lib/middleware/with-logging"

// Mock database
const programRegistrations: Array<{
  id: string
  programId: string
  userId: string
  userEmail: string
  userName: string
  registeredAt: string
  status: "pending" | "confirmed" | "cancelled"
}> = []

async function registerForProgram(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const programId = params.id
    const body = await request.json()

    // Sanitize input data
    const sanitizedData = sanitizeFormData(body)

    // Validate required fields
    const requiredFields = ["userEmail", "userName"]
    for (const field of requiredFields) {
      if (!sanitizedData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Check if user is already registered
    const existingRegistration = programRegistrations.find(
      (reg) => reg.programId === programId && reg.userEmail === sanitizedData.userEmail,
    )

    if (existingRegistration) {
      return NextResponse.json({ error: "You are already registered for this program" }, { status: 409 })
    }

    // Create registration
    const registration = {
      id: `reg-${Date.now()}`,
      programId,
      userId: sanitizedData.userId || `user-${Date.now()}`,
      userEmail: sanitizedData.userEmail,
      userName: sanitizedData.userName,
      registeredAt: new Date().toISOString(),
      status: "confirmed" as const,
    }

    programRegistrations.push(registration)

    return NextResponse.json(
      {
        message: "Successfully registered for program",
        registration: {
          id: registration.id,
          programId: registration.programId,
          status: registration.status,
          registeredAt: registration.registeredAt,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Program registration error:", error)
    return NextResponse.json({ error: "Failed to register for program" }, { status: 500 })
  }
}

// Apply CSRF protection and logging
export const POST = withLogging(withCSRFProtection(registerForProgram))
