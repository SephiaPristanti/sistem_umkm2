// Simple JWT implementation without external dependencies
interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "super_admin"
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

interface JWTPayload {
  userId: string
  email: string
  role: string
  permissions: string[]
  iat?: number
  exp?: number
}

// Mock admin users database (in production, use a real database)
const adminUsers: (AdminUser & { password: string })[] = [
  {
    id: "admin-1",
    email: "admin@si-umkm.com",
    password: "admin123", // In production, hash this properly
    name: "Admin Si-UMKM",
    role: "admin",
    permissions: ["read:products", "write:products", "read:users", "read:programs", "write:programs"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "super-admin-1",
    email: "superadmin@si-umkm.com",
    password: "admin123", // In production, hash this properly
    name: "Super Admin Si-UMKM",
    role: "super_admin",
    permissions: ["*"], // All permissions
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Simple base64 encoding/decoding for demo purposes
const base64UrlEncode = (str: string): string => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

const base64UrlDecode = (str: string): string => {
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  while (str.length % 4) {
    str += "="
  }
  return atob(str)
}

// Simple JWT implementation for demo
export const generateJWT = (payload: Omit<JWTPayload, "iat" | "exp">): string => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const now = Math.floor(Date.now() / 1000)
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))

  // Simple signature for demo (in production, use proper HMAC)
  const signature = base64UrlEncode(`${encodedHeader}.${encodedPayload}.demo-signature`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Verify JWT token (simplified for demo)
export const verifyJWT = (token: string): JWTPayload => {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid token format")
    }

    const payload = JSON.parse(base64UrlDecode(parts[1]))

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Token expired")
    }

    return payload as JWTPayload
  } catch (error) {
    throw new Error("Invalid or expired token")
  }
}

// Admin login
export const adminLogin = async (email: string, password: string): Promise<{ token: string; user: AdminUser }> => {
  try {
    // Find admin user
    const adminUser = adminUsers.find((user) => user.email === email)
    if (!adminUser) {
      throw new Error("Invalid credentials")
    }

    // Verify password (simplified for demo)
    const isValidPassword = password === adminUser.password

    if (!isValidPassword) {
      throw new Error("Invalid credentials")
    }

    // Generate JWT token
    const token = generateJWT({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      permissions: adminUser.permissions,
    })

    // Remove password from response
    const { password: _, ...userResponse } = adminUser

    return {
      token,
      user: userResponse,
    }
  } catch (error) {
    console.error("Error in admin login:", error)
    throw error
  }
}

// Get admin user by ID
export const getAdminUser = async (id: string): Promise<AdminUser | null> => {
  try {
    const adminUser = adminUsers.find((user) => user.id === id)
    if (!adminUser) {
      return null
    }

    // Remove password from response
    const { password: _, ...userResponse } = adminUser
    return userResponse
  } catch (error) {
    console.error("Error getting admin user:", error)
    throw error
  }
}

// Check if user has permission
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  // Super admin has all permissions
  if (userPermissions.includes("*")) {
    return true
  }

  return userPermissions.includes(requiredPermission)
}

// Middleware to verify admin JWT
export const verifyAdminToken = (token: string): JWTPayload => {
  try {
    const decoded = verifyJWT(token)

    // Check if user is admin
    if (!["admin", "super_admin"].includes(decoded.role)) {
      throw new Error("Insufficient privileges")
    }

    return decoded
  } catch (error) {
    throw new Error("Unauthorized")
  }
}

export type { AdminUser, JWTPayload }
