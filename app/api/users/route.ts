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

// Simple password hashing for demo (in production, use bcrypt)
const hashPassword = (password: string): string => {
  return btoa(password) // Very simple encoding for demo
}

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = users.slice(startIndex, endIndex)

    // Remove password from response
    const safeUsers = paginatedUsers.map(({ password, ...user }) => user)

    const response = {
      users: safeUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(users.length / limit),
        totalItems: users.length,
        hasNext: endIndex < users.length,
        hasPrev: page > 1,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST /api/users - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["email", "password", "name", "businessName"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === body.email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Hash password (simplified for demo)
    const hashedPassword = hashPassword(body.password)

    // Create new user
    const newUser = {
      id: users.length + 1,
      ...body,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Generate simple token
    const token = generateSimpleToken(newUser.id, newUser.email)

    // Remove password from response
    const { password, ...userResponse } = newUser

    return NextResponse.json(
      {
        user: userResponse,
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
