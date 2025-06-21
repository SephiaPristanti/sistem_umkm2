import { type NextRequest, NextResponse } from "next/server"

// Mock database
const reviews = [
  {
    id: 1,
    productId: 1,
    userId: 1,
    userName: "Andi Pratama",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Keripik singkongnya enak banget! Gurih dan renyah, pasti beli lagi!",
    images: [],
    helpful: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET /api/reviews - Get reviews with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const userId = searchParams.get("userId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    let filteredReviews = [...reviews]

    // Filter by product
    if (productId) {
      filteredReviews = filteredReviews.filter((review) => review.productId === Number.parseInt(productId))
    }

    // Filter by user
    if (userId) {
      filteredReviews = filteredReviews.filter((review) => review.userId === Number.parseInt(userId))
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex)

    const response = {
      reviews: paginatedReviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredReviews.length / limit),
        totalItems: filteredReviews.length,
        hasNext: endIndex < filteredReviews.length,
        hasPrev: page > 1,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["productId", "userId", "rating", "comment"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Create new review
    const newReview = {
      id: reviews.length + 1,
      ...body,
      helpful: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    reviews.push(newReview)

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
