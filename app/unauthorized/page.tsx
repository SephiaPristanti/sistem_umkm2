import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-6">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Akses Ditolak</h1>

        <p className="text-gray-600 mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda yakin seharusnya
          memiliki akses.
        </p>

        <div className="flex flex-col space-y-3">
          <Link href="/">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>

          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Login dengan Akun Lain
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
