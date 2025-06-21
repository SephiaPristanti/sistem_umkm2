import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth/jwt-auth"
import { sanitizeFormData } from "@/lib/security/sanitization"

// Mock database - sama seperti di route.ts
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
]

// GET /api/admin/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("GET /api/admin/products/[id] called with id:", params.id)

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyJWT(token)

    if (!["admin", "super_admin", "umkm"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const productId = Number.parseInt(params.id)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // For UMKM users, only allow viewing their own products
    if (decoded.role === "umkm" && product.businessId !== decoded.businessId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Returning product:", product)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error in GET /api/admin/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PUT /api/admin/products/[id] called with id:", params.id)

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyJWT(token)

    if (!["admin", "super_admin", "umkm"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const productId = Number.parseInt(params.id)
    const productIndex = products.findIndex((p) => p.id === productId)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const body = await request.json()
    console.log("Update request body:", body)

    const sanitizedData = sanitizeFormData(body)

    // For UMKM users, only allow editing their own products
    if (decoded.role === "umkm" && products[productIndex].businessId !== decoded.businessId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      name: sanitizedData.name || products[productIndex].name,
      description: sanitizedData.description || products[productIndex].description,
      price: sanitizedData.price ? Number(sanitizedData.price) : products[productIndex].price,
      originalPrice: sanitizedData.originalPrice
        ? Number(sanitizedData.originalPrice)
        : products[productIndex].originalPrice,
      category: sanitizedData.category || products[productIndex].category,
      stock: sanitizedData.stock ? Number(sanitizedData.stock) : products[productIndex].stock,
      images: sanitizedData.images || products[productIndex].images,
      businessName: sanitizedData.businessName || products[productIndex].businessName,
      location: sanitizedData.location || products[productIndex].location,
      discount:
        sanitizedData.originalPrice && sanitizedData.price
          ? Math.round(
              ((Number(sanitizedData.originalPrice) - Number(sanitizedData.price)) /
                Number(sanitizedData.originalPrice)) *
                100,
            )
          : products[productIndex].discount,
      updatedAt: new Date().toISOString(),
    }

    products[productIndex] = updatedProduct
    console.log("Updated product:", updatedProduct)

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error in PUT /api/admin/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("DELETE /api/admin/products/[id] called with id:", params.id)

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyJWT(token)

    if (!["admin", "super_admin"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden - Only admins can delete products" }, { status: 403 })
    }

    const productId = Number.parseInt(params.id)
    const productIndex = products.findIndex((p) => p.id === productId)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Remove product
    const deletedProduct = products[productIndex]
    products.splice(productIndex, 1)

    console.log("Deleted product:", deletedProduct)
    return NextResponse.json({ message: "Product deleted successfully", product: deletedProduct })
  } catch (error) {
    console.error("Error in DELETE /api/admin/products/[id]:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
