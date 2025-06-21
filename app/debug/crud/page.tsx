import CRUDTester from "@/components/debug/crud-tester"

export default function CRUDDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">CRUD Debug Center</h1>
          <p className="text-gray-600">Test and debug all CRUD operations</p>
        </div>
        <CRUDTester />
      </div>
    </div>
  )
}
