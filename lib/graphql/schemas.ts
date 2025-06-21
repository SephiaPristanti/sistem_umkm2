import { gql } from "graphql-tag"

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    businessName: String
    businessType: String
    businessCategory: String
    phone: String
    address: String
    description: String
    createdAt: String!
    updatedAt: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    originalPrice: Float
    category: String!
    images: [String!]!
    stock: Int!
    sold: Int!
    views: Int!
    rating: Float!
    reviewCount: Int!
    businessId: ID!
    business: Business!
    location: String!
    discount: Int
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Business {
    id: ID!
    name: String!
    owner: String!
    email: String!
    phone: String!
    address: String!
    description: String
    category: String!
    type: String!
    established: String
    products: [Product!]!
    rating: Float!
    reviewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Review {
    id: ID!
    productId: ID!
    product: Product!
    userId: ID!
    user: User!
    rating: Int!
    comment: String!
    images: [String!]
    helpful: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Program {
    id: ID!
    title: String!
    description: String!
    organizer: String!
    category: String!
    type: String!
    status: String!
    startDate: String!
    endDate: String!
    duration: String!
    participants: Int!
    registered: Int!
    location: String!
    mode: String!
    price: String!
    benefits: [String!]!
    requirements: [String!]!
    image: String
    createdAt: String!
    updatedAt: String!
  }

  type ProgramRegistration {
    id: ID!
    programId: ID!
    program: Program!
    userId: ID!
    user: User!
    status: String!
    registeredAt: String!
  }

  input ProductFilter {
    category: String
    minPrice: Float
    maxPrice: Float
    location: String
    rating: Float
    inStock: Boolean
  }

  input ProductSort {
    field: String!
    direction: String!
  }

  input ProgramFilter {
    category: String
    status: String
    location: String
    mode: String
    organizer: String
  }

  type ProductSearchResult {
    products: [Product!]!
    total: Int!
    hasMore: Boolean!
  }

  type ProgramSearchResult {
    programs: [Program!]!
    total: Int!
    hasMore: Boolean!
  }

  type Query {
    # Product queries
    searchProducts(
      query: String
      filter: ProductFilter
      sort: ProductSort
      limit: Int = 20
      offset: Int = 0
    ): ProductSearchResult!
    
    getProduct(id: ID!): Product
    getFeaturedProducts(limit: Int = 6): [Product!]!
    getProductsByBusiness(businessId: ID!): [Product!]!
    
    # Program queries
    searchPrograms(
      query: String
      filter: ProgramFilter
      limit: Int = 20
      offset: Int = 0
    ): ProgramSearchResult!
    
    getProgram(id: ID!): Program
    getFeaturedPrograms(limit: Int = 6): [Program!]!
    getUpcomingPrograms(limit: Int = 10): [Program!]!
    
    # Business queries
    getBusiness(id: ID!): Business
    searchBusinesses(query: String, limit: Int = 20): [Business!]!
    
    # User queries
    getUser(id: ID!): User
    getCurrentUser: User
    
    # Review queries
    getProductReviews(productId: ID!, limit: Int = 20, offset: Int = 0): [Review!]!
    getBusinessReviews(businessId: ID!, limit: Int = 20, offset: Int = 0): [Review!]!
  }

  type Mutation {
    # Auth mutations
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    
    # Product mutations
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    
    # Review mutations
    createReview(input: CreateReviewInput!): Review!
    updateReview(id: ID!, input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
    markReviewHelpful(id: ID!): Review!
    
    # Program mutations
    registerForProgram(programId: ID!): ProgramRegistration!
    cancelProgramRegistration(programId: ID!): Boolean!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
    businessName: String!
    businessType: String!
    businessCategory: String!
    phone: String!
    address: String!
    description: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateProductInput {
    name: String!
    description: String!
    price: Float!
    originalPrice: Float
    category: String!
    images: [String!]!
    stock: Int!
    location: String!
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    originalPrice: Float
    category: String
    images: [String!]
    stock: Int
    location: String
    isActive: Boolean
  }

  input CreateReviewInput {
    productId: ID!
    rating: Int!
    comment: String!
    images: [String!]
  }

  input UpdateReviewInput {
    rating: Int
    comment: String
    images: [String!]
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`
