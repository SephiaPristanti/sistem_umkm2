import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import SecureProgramRegistrationForm from "@/components/programs/secure-registration-form";
import { verifyJWT } from "@/lib/auth/jwt-auth"

// Mock data fetching functions
async function getDashboardStats() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return {
    totalUMKM: 300,
    totalProducts: 500,
    totalPrograms: 75,
    activePrograms: 25,
    monthlyRevenue: "Rp 75.000.000",
    growthRate: 12.5,
    newRegistrations: 25,
    completedPrograms: 8,
  }
}

async function getRecentActivities() {
  await new Promise((resolve) => setTimeout(resolve, 150))

  return [
    {
      id: 1,
      type: "registration",
      message: "UMKM Baru 'Keripik Mawar' mendaftar",
      timestamp: "2 menit yang lalu",
      user: "Sari Wijaya",
    },
    {
      id: 2,
      type: "product",
      message: "Produk baru 'Tas Rajut Premium' ditambahkan",
      timestamp: "15 menit yang lalu",
      user: "Maya Sari",
    },
    {
      id: 3,
      type: "program",
      message: "Program 'Digital Marketing' mencapai 50 peserta",
      timestamp: "1 jam yang lalu",
      user: "Admin",
    },
  ]
}

async function getTopProducts() {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return [
    {
      id: 1,
      name: "Fudgy Brownies",
      business: "Sweet Bites",
      sales: 125,
      revenue: "Rp 1.875.000",
      growth: 15.2,
    },
    {
      id: 2,
      name: "Tas Rajut Handmade",
      business: "Rajut Cantik",
      sales: 89,
      revenue: "Rp 7.565.000",
      growth: 8.7,
    },
    {
      id: 3,
      name: "Smoothie",
      business: "Fruity Vibes",
      sales: 115,
      revenue: "Rp 10.530.000",
      growth: 22.1,
    },
  ]
}

export const metadata: Metadata = {
  title: "Admin Dashboard | Si-UMKM",
  description: "Dashboard administrasi untuk mengelola platform Si-UMKM",
  robots: "noindex, nofollow", // Prevent search engine indexing
}

// Server-Side Rendering (SSR) - Rendered on each request
export default async function AdminDashboardPage() {
  // Verify admin authentication on server side
  const cookieStore = await cookies()
  const adminToken = cookieStore.get("admin_token")?.value

  if (!adminToken) {
    redirect("/auth/login?from=/admin/dashboard")
  }

  try {
    const decoded = verifyJWT(adminToken)

    if (!["admin", "super_admin"].includes(decoded.role)) {
      redirect("/unauthorized")
    }

    // Fetch data on server side for SSR
    const [dashboardStats, recentActivities, topProducts] = await Promise.all([
      getDashboardStats(),
      getRecentActivities(),
      getTopProducts(),
    ])

    return (
      <AdminDashboardClient
        user={decoded}
        dashboardStats={dashboardStats}
        recentActivities={recentActivities}
        topProducts={topProducts}
      />
    )
  } catch (error) {
    redirect("/auth/login?from=/admin/dashboard")
  }
}

// Force dynamic rendering for SSR
export const dynamic = "force-dynamic"
export const revalidate = 0
