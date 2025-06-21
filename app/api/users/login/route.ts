import { type NextRequest, NextResponse } from "next/server"

// Mock database
const users = [
  {
    id: 1,
    email: "sari@berkah.com",
    password: "password123", // In production, this would be properly hashed
    name: "Sari Wijaya",
    businessName: "UD. Berkah Jaya",
    businessType: "mikro",
    businessCategory: "makanan",
    phone: "+62 812-3456-7890",
    address: "Jl. Malioboro No. 123, Yogyakarta",
    description: "UMKM keluarga yang memproduksi keripik singkong berkualitas",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Simple token generation for demo
const generateSimpleToken = (userId: number, email: string): string => {
  const payload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  }

  // Simple base64 encoding for demo
  return btoa(JSON.stringify(payload))
}

// POST /api/users/login - User login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password (simplified for demo)
    const isValidPassword = password === user.password

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate simple token
    const token = generateSimpleToken(user.id, user.email)

    // Remove password from response
    const { password: _, ...userResponse } = user

    return NextResponse.json({
      user: userResponse,
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
