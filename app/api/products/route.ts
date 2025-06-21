import { type NextRequest, NextResponse } from "next/server"
import { withLogging } from "@/lib/middleware/with-logging"

// Mock database
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
    location: "Yogyakarta",
    discount: 17,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET /api/products - Get all products with filtering and pagination
async function getProducts(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    let filteredProducts = [...products]

    // Apply search filter
    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply category filter
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
    }

    // Apply sorting
    filteredProducts.sort((a: any, b: any) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      const direction = sortOrder === "desc" ? -1 : 1

      if (typeof aVal === "string") {
        return aVal.localeCompare(bVal) * direction
      }
      return (aVal - bVal) * direction
    })

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    const response = {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalItems: filteredProducts.length,
        hasNext: endIndex < filteredProducts.length,
        hasPrev: page > 1,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST /api/products - Create new product
async function createProduct(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "price", "category", "stock"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create new product
    const newProduct = {
      id: products.length + 1,
      ...body,
      sold: 0,
      views: 0,
      rating: 0,
      reviewCount: 0,
      discount: body.originalPrice ? Math.round(((body.originalPrice - body.price) / body.originalPrice) * 100) : 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

// Apply logging middleware to our handlers
export const GET = withLogging(getProducts)
export const POST = withLogging(createProduct)
