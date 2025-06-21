import ProtectedRoute from "@/components/auth/protected-route"
import ProductManagement from "@/components/admin/products/product-management"

function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProductManagement />
      </div>
    </div>
  )
}

export default function AdminProducts() {
  return (
    <ProtectedRoute requireAdmin={true} requiredPermissions={["read:products", "write:products"]}>
      <AdminProductsPage />
    </ProtectedRoute>
  )
}
