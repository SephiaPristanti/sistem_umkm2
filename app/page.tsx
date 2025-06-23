import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, BookOpen, TrendingUp, ShoppingBag, Award } from "lucide-react"

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: "Fudgy Brownies",
      business: "Sweet Bites",
      price: "Rp 120.000/box",
      rating: 4.8,
      reviews: 100,
      image: "/browni.jpg?height=200&width=200",
      category: "Makanan",
    },
    {
      id: 2,
      name: "Tas Rajut Handmade",
      business: "Rajut Cantik",
      price: "Rp 85.000",
      rating: 4.9,
      reviews: 89,
      image: "/rajut.jpg?height=200&width=200",
      category: "Kerajinan",
    },
    {
      id: 3,
      name: "Smoothie",
      business: "Fruity Vibes",
      price: "Rp 40.000",
      rating: 4.7,
      reviews: 90,
      image: "/smoothie.jpg?height=200&width=200",
      category: "Minuman",
    },
  ]

  const programs = [
    {
      title: "Pelatihan Digital Marketing",
      organizer: "Kementerian Koperasi dan UKM",
      date: "25-27 Juli 2025",
      participants: 50,
      status: "Pendaftaran Dibuka",
    },
    {
      title: "Workshop Manajemen Keuangan UMKM",
      organizer: "Bank Indonesia",
      date: "12-15 Agustus 2025",
      participants: 30,
      status: "Segera Dibuka",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">Si-UMKM</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">
                Produk
              </Link>
              <Link href="/programs" className="text-gray-600 hover:text-primary transition-colors">
                Program Pelatihan
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                Tentang
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Masuk</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Daftar UMKM</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Platform Digital untuk <span className="text-primary">UMKM</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Daftarkan produk UMKM Anda, dapatkan ulasan pelanggan, dan akses program pelatihan pemerintah dalam satu
              platform terintegrasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Mulai Berjualan
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Jelajahi Produk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">300+</h3>
              <p className="text-gray-600">UMKM Terdaftar</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Produk Tersedia</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">75+</h3>
              <p className="text-gray-600">Program Pelatihan</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">85%</h3>
              <p className="text-gray-600">Peningkatan Penjualan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Produk Unggulan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan produk-produk berkualitas dari UMKM terpercaya.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.business}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Link href="/products"></Link>
                    <span className="text-xl font-bold text-primary">{product.price}</span>
                    <Button size="sm">Lihat Detail</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                Lihat Semua Produk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Pelatihan Terbaru</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tingkatkan kemampuan bisnis Anda dengan program pelatihan dari pemerintah dan mitra terpercaya
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={program.status === "Pendaftaran Dibuka" ? "default" : "secondary"}>
                      {program.status}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{program.participants} peserta</span>
                    </div>
                  </div>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription>{program.organizer}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{program.date}</span>
                    <Button size="sm" disabled={program.status !== "Pendaftaran Dibuka"}>
                      {program.status === "Pendaftaran Dibuka" ? "Daftar Sekarang" : "Segera Hadir"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/programs">
              <Button variant="outline" size="lg">
                Lihat Semua Program
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Mengembangkan UMKM Anda?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Bergabunglah dengan ribuan UMKM lainnya dan rasakan manfaat platform digital terintegrasi untuk bisnis Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Daftar Gratis Sekarang
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary"
              >
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingBag className="h-8 w-8" />
                <span className="text-xl font-bold">Si-UMKM</span>
              </div>
              <p className="text-gray-400">Platform digital untuk mengembangkan UMKM era digital.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Layanan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Katalog Produk
                  </Link>
                </li>
                <li>
                  <Link href="/programs" className="hover:text-white transition-colors">
                    Program Pelatihan
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard UMKM
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Tentang</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Si-UMKM. Semua hak dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
