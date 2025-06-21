import ProtectedRoute from "@/components/auth/protected-route"
import UMKMProductManagement from "@/components/umkm/products/umkm-product-management"

function UMKMProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <UMKMProductManagement />
      </div>
    </div>
  )
}

export default function UMKMProducts() {
  return (
    <ProtectedRoute requiredPermissions={["read:own_products", "write:own_products"]}>
      <UMKMProductsPage />
    </ProtectedRoute>
  )
}
