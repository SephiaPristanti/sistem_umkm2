"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import UserProfileClient from "@/components/profile/user-profile-client"
import { Loader2 } from "lucide-react"

// Client-Side Rendering (CSR) - Rendered entirely on client
export default function UserProfilePage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [profileData, setProfileData] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?from=/profile")
      return
    }

    if (user && userProfile) {
      // Simulate additional profile data fetching
      const fetchProfileData = async () => {
        setProfileLoading(true)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock additional profile data
        const additionalData = {
          statistics: {
            totalProducts: 12,
            totalSales: 156,
            totalRevenue: "Rp 12.500.000",
            averageRating: 4.7,
            totalReviews: 89,
          },
          recentOrders: [
            {
              id: "ORD-001",
              product: "Keripik Singkong Original",
              customer: "Andi Pratama",
              amount: "Rp 15.000",
              status: "completed",
              date: "2024-01-15",
            },
            {
              id: "ORD-002",
              product: "Keripik Singkong Pedas",
              customer: "Maya Sari",
              amount: "Rp 16.000",
              status: "processing",
              date: "2024-01-14",
            },
          ],
          notifications: [
            {
              id: 1,
              type: "order",
              message: "Pesanan baru dari Andi Pratama",
              timestamp: "2 jam yang lalu",
              read: false,
            },
            {
              id: 2,
              type: "review",
              message: "Ulasan baru untuk produk Keripik Singkong",
              timestamp: "1 hari yang lalu",
              read: true,
            },
          ],
        }

        setProfileData(additionalData)
        setProfileLoading(false)
      }

      fetchProfileData()
    }
  }, [user, userProfile, loading, router])

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return null // Will redirect to login
  }

  return <UserProfileClient user={user} userProfile={userProfile} profileData={profileData} />
}

// Force client-side rendering
export const dynamic = "force-dynamic"
