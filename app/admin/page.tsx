import ProtectedRoute from "@/components/auth/protected-route"

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total UMKM</h3>
            <p className="text-3xl font-bold text-primary">300</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Produk</h3>
            <p className="text-3xl font-bold text-primary">500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Program Aktif</h3>
            <p className="text-3xl font-bold text-primary">25</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true} requiredPermissions={["read:dashboard"]}>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
