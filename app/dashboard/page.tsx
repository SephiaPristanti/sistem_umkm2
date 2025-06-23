"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Package,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  LogOut,
} from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const businessStats = {
    totalProducts: 12,
    totalViews: 2450,
    totalSales: 156,
    averageRating: 4.7,
    totalReviews: 89,
    monthlyRevenue: "Rp 12,500,000",
  }

  const products = [
    {
      id: 1,
      name: "Fudgy Brownies",
      price: "Rp 120.000/box",
      stock: 100,
      sold: 500,
      views: 124,
      rating: 4.8,
      reviews: 24,
      status: "Aktif",
      image: "/browni.jpg?height=80&width=80",
    },
    {
      id: 2,
      name: "Fudgy Brownies Rasberi",
      price: "Rp 140.000/box",
      stock: 100,
      sold: 89,
      views: 120,
      rating: 4.6,
      reviews: 18,
      status: "Aktif",
      image: "/ras.jpg?height=80&width=80",
    },
    {
      id: 3,
      name: "Fudgy Brownies Matcha",
      price: "Rp 130.000/box",
      stock: 0,
      sold: 67,
      views: 280,
      rating: 4.5,
      reviews: 15,
      status: "Stok Habis",
      image: "/matcha.jpg?height=80&width=80",
    },
  ]

  const recentReviews = [
    {
      id: 1,
      product: "Fudgy Brownies",
      customer: "Andi Pratama",
      rating: 5,
      comment: "Enak banget! Manisnya pas, pasti beli lagi!",
      date: "2 hari yang lalu",
    },
    {
      id: 2,
      product: "Fudgy Brownies Matcha",
      customer: "Maya Sari",
      rating: 4,
      comment: "Rasa matchanya berasa banget, tekstur browniesnya juga enak.",
      date: "3 hari yang lalu",
    },
  ]

  const upcomingPrograms = [
    {
      id: 1,
      title: "Pelatihan Digital Marketing",
      date: "15 Januari 2025",
      status: "Terdaftar",
    },
    {
      id: 2,
      title: "Workshop Manajemen Keuangan",
      date: "22 Januari 2025",
      status: "Menunggu",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-primary">Si-UMKM</span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="font-medium">Dashboard UMKM</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Sweet Bites</h1>
          <p className="text-gray-600">Kelola produk dan pantau performa bisnis Anda</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="products">Produk</TabsTrigger>
            <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            <TabsTrigger value="programs">Program</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessStats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">3 produk aktif</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessStats.totalSales}</div>
                  <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessStats.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+8% dari bulan lalu</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessStats.averageRating}</div>
                  <p className="text-xs text-muted-foreground">{businessStats.totalReviews} ulasan</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Pendapatan Bulanan</CardTitle>
                <CardDescription>Grafik pendapatan 6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Grafik pendapatan akan ditampilkan di sini</p>
                    <p className="text-2xl font-bold text-primary mt-2">{businessStats.monthlyRevenue}</p>
                    <p className="text-sm text-gray-500">Pendapatan bulan ini</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ulasan Terbaru</CardTitle>
                  <CardDescription>Ulasan terbaru dari pelanggan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{review.customer}</p>
                          <p className="text-xs text-gray-500">{review.product}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  ))}
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Lihat semua ulasan →
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Program Pelatihan</CardTitle>
                  <CardDescription>Program yang akan datang</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingPrograms.map((program) => (
                    <div key={program.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{program.title}</p>
                        <p className="text-xs text-gray-500">{program.date}</p>
                      </div>
                      <Badge variant={program.status === "Terdaftar" ? "default" : "secondary"}>{program.status}</Badge>
                    </div>
                  ))}
                  <Link href="/programs" className="text-sm text-primary hover:underline">
                    Lihat program lainnya →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Kelola Produk</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Button>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Badge variant={product.status === "Aktif" ? "default" : "destructive"}>
                            {product.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Harga</p>
                            <p className="font-medium">{product.price}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Stok</p>
                            <p className="font-medium">{product.stock}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Terjual</p>
                            <p className="font-medium">{product.sold}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Views</p>
                            <p className="font-medium">{product.views}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Rating</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{product.rating}</span>
                              <span className="text-gray-400">({product.reviews})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Ulasan Pelanggan</h2>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{businessStats.averageRating}</div>
                  <div className="flex items-center justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(businessStats.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{businessStats.totalReviews} ulasan</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {recentReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{review.customer}</h3>
                        <p className="text-sm text-gray-500">{review.product}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-400">{review.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Program Pelatihan</h2>
              <Link href="/programs">
                <Button variant="outline">Cari Program Baru</Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {upcomingPrograms.map((program) => (
                <Card key={program.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{program.title}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{program.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={program.status === "Terdaftar" ? "default" : "secondary"}>
                          {program.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rekomendasi Program</CardTitle>
                <CardDescription>Program yang mungkin cocok untuk bisnis Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Pelatihan E-commerce dan Marketplace</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Pelajari cara mengoptimalkan penjualan online di berbagai platform
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">1-3 Februari 2025</span>
                      <Button size="sm">Daftar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
