import { GraphQLError } from "graphql"

// Mock database - in production, replace with actual database
const mockData = {
  users: [
    {
      id: "1",
      email: "sari@berkah.com",
      name: "Sari Wijaya",
      businessName: "UD. Berkah Jaya",
      businessType: "mikro",
      businessCategory: "makanan",
      phone: "+62 812-3456-7890",
      address: "Jl. Malioboro No. 123, Yogyakarta",
      description: "UMKM keluarga yang memproduksi keripik singkong berkualitas",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  products: [
    {
      id: "1",
      name: "Keripik Singkong Original Premium",
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
      businessId: "1",
      location: "Yogyakarta",
      discount: 17,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  businesses: [
    {
      id: "1",
      name: "UD. Berkah Jaya",
      owner: "Sari Wijaya",
      email: "sari@berkah.com",
      phone: "+62 812-3456-7890",
      address: "Jl. Malioboro No. 123, Yogyakarta",
      description: "UMKM keluarga yang memproduksi keripik singkong berkualitas",
      category: "makanan",
      type: "mikro",
      established: "2018",
      rating: 4.8,
      reviewCount: 89,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  programs: [
    {
      id: "1",
      title: "Pelatihan Digital Marketing untuk UMKM",
      description: "Program pelatihan komprehensif untuk meningkatkan kemampuan digital marketing UMKM",
      organizer: "Kementerian Koperasi dan UKM",
      category: "Digital Marketing",
      type: "Pelatihan",
      status: "Pendaftaran Dibuka",
      startDate: "2025-01-15T00:00:00Z",
      endDate: "2025-01-17T00:00:00Z",
      duration: "3 hari",
      participants: 50,
      registered: 32,
      location: "Jakarta",
      mode: "Hybrid",
      price: "Gratis",
      benefits: ["Sertifikat resmi", "Modul digital", "Konsultasi gratis"],
      requirements: ["UMKM aktif", "Laptop/smartphone", "Komitmen full program"],
      image: "/placeholder.svg?height=200&width=300",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  reviews: [
    {
      id: "1",
      productId: "1",
      userId: "1",
      rating: 5,
      comment: "Keripik singkongnya enak banget! Gurih dan renyah, pasti beli lagi!",
      images: [],
      helpful: 12,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
}

// Simple token verification for demo
const getUser = (token: string) => {
  try {
    if (!token) return null

    // Simple token verification for demo
    const cleanToken = token.replace("Bearer ", "")
    const decoded = JSON.parse(atob(cleanToken))

    // Check expiration
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return mockData.users.find((user) => user.id === decoded.userId.toString())
  } catch {
    return null
  }
}

// Simple password hashing for demo
const hashPassword = (password: string): string => {
  return btoa(password) // Very simple encoding for demo
}

// Simple token generation for demo
const generateSimpleToken = (userId: string, email: string): string => {
  const payload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  }

  return btoa(JSON.stringify(payload))
}

export const resolvers = {
  Query: {
    // Product queries
    searchProducts: async (_: any, { query, filter, sort, limit, offset }: any) => {
      let products = [...mockData.products]

      // Apply search query
      if (query) {
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()),
        )
      }

      // Apply filters
      if (filter) {
        if (filter.category) {
          products = products.filter((p) => p.category === filter.category)
        }
        if (filter.minPrice) {
          products = products.filter((p) => p.price >= filter.minPrice)
        }
        if (filter.maxPrice) {
          products = products.filter((p) => p.price <= filter.maxPrice)
        }
        if (filter.location) {
          products = products.filter((p) => p.location === filter.location)
        }
        if (filter.rating) {
          products = products.filter((p) => p.rating >= filter.rating)
        }
        if (filter.inStock) {
          products = products.filter((p) => p.stock > 0)
        }
      }

      // Apply sorting
      if (sort) {
        products.sort((a: any, b: any) => {
          const aVal = a[sort.field]
          const bVal = b[sort.field]
          const direction = sort.direction === "DESC" ? -1 : 1
          return aVal > bVal ? direction : aVal < bVal ? -direction : 0
        })
      }

      const total = products.length
      const paginatedProducts = products.slice(offset, offset + limit)

      return {
        products: paginatedProducts,
        total,
        hasMore: offset + limit < total,
      }
    },

    getProduct: (_: any, { id }: any) => {
      return mockData.products.find((product) => product.id === id)
    },

    getFeaturedProducts: (_: any, { limit }: any) => {
      return mockData.products.slice(0, limit)
    },

    // Program queries
    searchPrograms: async (_: any, { query, filter, limit, offset }: any) => {
      let programs = [...mockData.programs]

      // Apply search query
      if (query) {
        programs = programs.filter(
          (program) =>
            program.title.toLowerCase().includes(query.toLowerCase()) ||
            program.organizer.toLowerCase().includes(query.toLowerCase()),
        )
      }

      // Apply filters
      if (filter) {
        if (filter.category) {
          programs = programs.filter((p) => p.category === filter.category)
        }
        if (filter.status) {
          programs = programs.filter((p) => p.status === filter.status)
        }
        if (filter.location) {
          programs = programs.filter((p) => p.location === filter.location)
        }
        if (filter.mode) {
          programs = programs.filter((p) => p.mode === filter.mode)
        }
        if (filter.organizer) {
          programs = programs.filter((p) => p.organizer === filter.organizer)
        }
      }

      const total = programs.length
      const paginatedPrograms = programs.slice(offset, offset + limit)

      return {
        programs: paginatedPrograms,
        total,
        hasMore: offset + limit < total,
      }
    },

    getProgram: (_: any, { id }: any) => {
      return mockData.programs.find((program) => program.id === id)
    },

    getFeaturedPrograms: (_: any, { limit }: any) => {
      return mockData.programs.slice(0, limit)
    },

    // Business queries
    getBusiness: (_: any, { id }: any) => {
      return mockData.businesses.find((business) => business.id === id)
    },

    // User queries
    getCurrentUser: (_: any, __: any, { user }: any) => {
      if (!user)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      return user
    },

    // Review queries
    getProductReviews: (_: any, { productId, limit, offset }: any) => {
      const reviews = mockData.reviews.filter((review) => review.productId === productId)
      return reviews.slice(offset, offset + limit)
    },
  },

  Mutation: {
    // Auth mutations
    register: async (_: any, { input }: any) => {
      const existingUser = mockData.users.find((user) => user.email === input.email)
      if (existingUser) {
        throw new GraphQLError("Email already exists", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      }

      const hashedPassword = hashPassword(input.password)
      const newUser = {
        id: String(mockData.users.length + 1),
        ...input,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockData.users.push(newUser)

      const token = generateSimpleToken(newUser.id, newUser.email)

      return {
        token,
        user: newUser,
      }
    },

    login: async (_: any, { input }: any) => {
      const user = mockData.users.find((user) => user.email === input.email)
      if (!user) {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      // In production, verify password properly
      const validPassword = input.password === "password123" // Demo password

      if (!validPassword) {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        })
      }

      const token = generateSimpleToken(user.id, user.email)

      return {
        token,
        user,
      }
    },

    // Product mutations
    createProduct: async (_: any, { input }: any, { user }: any) => {
      if (!user)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        })

      const newProduct = {
        id: String(mockData.products.length + 1),
        ...input,
        businessId: user.id,
        sold: 0,
        views: 0,
        rating: 0,
        reviewCount: 0,
        discount: input.originalPrice
          ? Math.round(((input.originalPrice - input.price) / input.originalPrice) * 100)
          : 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockData.products.push(newProduct)
      return newProduct
    },

    updateProduct: async (_: any, { id, input }: any, { user }: any) => {
      if (!user)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        })

      const productIndex = mockData.products.findIndex((p) => p.id === id)
      if (productIndex === -1) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      }

      const product = mockData.products[productIndex]
      if (product.businessId !== user.id) {
        throw new GraphQLError("Not authorized to update this product", {
          extensions: { code: "FORBIDDEN" },
        })
      }

      const updatedProduct = {
        ...product,
        ...input,
        updatedAt: new Date().toISOString(),
      }

      mockData.products[productIndex] = updatedProduct
      return updatedProduct
    },

    deleteProduct: async (_: any, { id }: any, { user }: any) => {
      if (!user)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        })

      const productIndex = mockData.products.findIndex((p) => p.id === id)
      if (productIndex === -1) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "BAD_USER_INPUT" },
        })
      }

      const product = mockData.products[productIndex]
      if (product.businessId !== user.id) {
        throw new GraphQLError("Not authorized to delete this product", {
          extensions: { code: "FORBIDDEN" },
        })
      }

      mockData.products.splice(productIndex, 1)
      return true
    },

    // Review mutations
    createReview: async (_: any, { input }: any, { user }: any) => {
      if (!user)
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        })

      const newReview = {
        id: String(mockData.reviews.length + 1),
        ...input,
        userId: user.id,
        helpful: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockData.reviews.push(newReview)
      return newReview
    },
  },

  // Type resolvers
  Product: {
    business: (product: any) => {
      return mockData.businesses.find((business) => business.id === product.businessId)
    },
  },

  Business: {
    products: (business: any) => {
      return mockData.products.filter((product) => product.businessId === business.id)
    },
  },

  Review: {
    product: (review: any) => {
      return mockData.products.find((product) => product.id === review.productId)
    },
    user: (review: any) => {
      return mockData.users.find((user) => user.id === review.userId)
    },
  },
}
