"use client"

import { ApolloProvider } from "@apollo/client"
import client from "@/lib/apollo-client"
import type React from "react"

interface ClientApolloProviderProps {
  children: React.ReactNode
}

export function ClientApolloProvider({ children }: ClientApolloProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
