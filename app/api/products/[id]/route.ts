import { type NextRequest, NextResponse } from "next/server"

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

// GET /api/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Increment view count
    product.views += 1

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const body = await request.json()

    const productIndex = products.findIndex((p) => p.id === productId)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    products[productIndex] = updatedProduct

    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const productIndex = products.findIndex((p) => p.id === productId)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Remove product
    products.splice(productIndex, 1)

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
