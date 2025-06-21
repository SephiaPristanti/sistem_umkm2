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
]

// GET /api/umkm/products - Get products for specific UMKM
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyJWT(token)

    if (decoded.role !== "umkm") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    // Filter products by business ID
    let filteredProducts = products.filter((product) => product.businessId === decoded.businessId)

    // Apply search filter
    if (search) {
      filteredProducts = filteredProducts.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/umkm/products - Create new product for UMKM
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyJWT(token)

    if (decoded.role !== "umkm") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const sanitizedData = sanitizeFormData(body)

    // Validate required fields
    const requiredFields = ["name", "description", "price", "category", "stock"]
    for (const field of requiredFields) {
      if (!sanitizedData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create new product with UMKM's business ID
    const newProduct = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      ...sanitizedData,
      businessId: decoded.businessId,
      businessName: decoded.businessName || "UMKM User",
      location: decoded.location || "Indonesia",
      sold: 0,
      views: 0,
      rating: 0,
      reviewCount: 0,
      discount: sanitizedData.originalPrice
        ? Math.round(((sanitizedData.originalPrice - sanitizedData.price) / sanitizedData.originalPrice) * 100)
        : 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
