"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  requiredPermissions?: string[]
  fallbackPath?: string
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  requiredPermissions = [],
  fallbackPath = "/auth/login",
}: ProtectedRouteProps) {
  const { user, userProfile, adminUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Check authentication requirements
    if (requireAuth && !user && !adminUser) {
      router.push(fallbackPath)
      return
    }

    // Check admin requirements
    if (requireAdmin && !adminUser) {
      router.push("/auth/login")
      return
    }

    // Check specific permissions for admin users
    if (requireAdmin && adminUser && requiredPermissions.length > 0) {
      const hasRequiredPermissions = requiredPermissions.every(
        (permission) => adminUser.permissions.includes("*") || adminUser.permissions.includes(permission),
      )

      if (!hasRequiredPermissions) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, userProfile, adminUser, loading, requireAuth, requireAdmin, requiredPermissions, router, fallbackPath])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (requireAuth && !user && !adminUser) return null
  if (requireAdmin && !adminUser) return null

  return <>{children}</>
}
