"use client"

import type React from "react"
import { ClientApolloProvider } from "./apollo-provider"
import { AuthProvider } from "@/contexts/auth-context"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ClientApolloProvider>{children}</ClientApolloProvider>
    </AuthProvider>
  )
}
