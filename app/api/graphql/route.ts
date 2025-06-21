import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { typeDefs } from "@/lib/graphql/schemas"
import { resolvers } from "@/lib/graphql/resolvers"
import type { NextRequest } from "next/server"

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== "production",
  plugins: [
    // Add plugins for production monitoring
    ...(process.env.NODE_ENV === "production" ? [] : []),
  ],
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    const token = req.headers.get("authorization") || ""

    // Get user from token (simplified for demo)
    let user = null
    if (token) {
      // In production, verify JWT token and get user
      user = { id: "1", email: "sari@berkah.com" }
    }

    return { user }
  },
})

export { handler as GET, handler as POST }
