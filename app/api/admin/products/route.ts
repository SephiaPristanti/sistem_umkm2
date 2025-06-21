import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth/jwt-auth"
import { sanitizeFormData } from "@/lib/security/sanitization"

// Mock database - dalam implementasi nyata gunakan database
const products = [
  {
    id: 1,
    name: "Keripik Singkong Original",
    description: "Keripik singkong premium dengan rasa original yang gurih dan renyah",
    price: 15000,
    originalPrice: 18000,
    category: "Makanan",
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 50,
    sold: 125,
    views: 450,
    rating: 4.8,
    reviewCount: 24,
    businessId: 1,
    businessName: "UD. Berkah Jaya",
    location: "Yogyakarta",
    discount: 17,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Tas Rajut Handmade",
    description: "Tas rajut berkualitas tinggi dibuat dengan tangan oleh pengrajin lokal",
    price: 85000,
    originalPrice: 100000,
    category: "Fashion",
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 25,
    sold: 89,
    views: 320,
    rating: 4.6,
    reviewCount: 18,
    businessId: 2,
    businessName: "Rajut Cantik",
    location: "Bandung",
    discount: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Kopi Arabica Premium",
    description: "Kopi arabica pilihan dari petani lokal dengan cita rasa yang khas",
    price: 45000,
    originalPrice: 50000,
    category: "Makanan",
    images: ["/placeholder.svg?height=400&width=400"],
    stock: 30,
    sold: 67,
    views: 280,
    rating: 4.7,
    reviewCount: 15,
    businessId: 1,
    businessName: "UD. Berkah Jaya",
    location: "Yogyakarta",
    discount: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET /api/admin/products - Get all products for admin
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/products called")

    const authHeader = request.headers.get("authorization")
    console.log("Auth header:", authHeader)

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No valid auth header")
      return NextResponse.json({ error: "Unauthorized - No valid token" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    console.log("Token:", token?.substring(0, 20) + "...")

    let decoded
    try {
      decoded = verifyJWT(token)
      console.log("Decoded token:", { userId: decoded.userId, role: decoded.role })
    } catch (jwtError) {
      console.log("JWT verification failed:", jwtError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Allow admin, super_admin, and umkm to view products
    if (!["admin", "super_admin", "umkm"].includes(decoded.role)) {
      console.log("Insufficient permissions:", decoded.role)
      return NextResponse.json({ error: "Forbidden - Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const status = searchParams.get("status") || ""

    console.log("Query params:", { page, limit, search, category, status })

    let filteredProducts = [...products]

    // Apply filters
    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.businessName.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
    }

    if (status && status !== "all") {
      const isActive = status === "active"
      filteredProducts = filteredProducts.filter((product) => product.isActive === isActive)
    }

    // For UMKM users, only show their own products
    if (decoded.role === "umkm") {
      filteredProducts = filteredProducts.filter((product) => product.businessId === decoded.businessId)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    console.log(`Returning ${paginatedProducts.length} products out of ${filteredProducts.length} total`)

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalItems: filteredProducts.length,
        hasNext: endIndex < filteredProducts.length,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error in GET /api/admin/products:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/admin/products called")

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyJWT(token)

    if (!["admin", "super_admin", "umkm"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    console.log("Request body:", body)

    const sanitizedData = sanitizeFormData(body)

    // Validate required fields
    const requiredFields = ["name", "description", "price", "category", "stock"]
    for (const field of requiredFields) {
      if (!sanitizedData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create new product
    const newProduct = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      name: sanitizedData.name,
      description: sanitizedData.description,
      price: Number(sanitizedData.price),
      originalPrice: sanitizedData.originalPrice ? Number(sanitizedData.originalPrice) : undefined,
      category: sanitizedData.category,
      stock: Number(sanitizedData.stock),
      images: sanitizedData.images || ["/placeholder.svg?height=400&width=400"],
      businessId: decoded.role === "umkm" ? decoded.businessId : sanitizedData.businessId || 1,
      businessName:
        decoded.role === "umkm"
          ? decoded.businessName || "UMKM User"
          : sanitizedData.businessName || "Default Business",
      location: decoded.role === "umkm" ? decoded.location || "Indonesia" : sanitizedData.location || "Indonesia",
      sold: 0,
      views: 0,
      rating: 0,
      reviewCount: 0,
      discount:
        sanitizedData.originalPrice && sanitizedData.price
          ? Math.round(
              ((Number(sanitizedData.originalPrice) - Number(sanitizedData.price)) /
                Number(sanitizedData.originalPrice)) *
                100,
            )
          : 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)
    console.log("Created product:", newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/admin/products:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
