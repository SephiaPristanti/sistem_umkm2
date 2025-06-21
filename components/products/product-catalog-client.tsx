"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, Filter, ShoppingBag, MapPin, Heart, Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  business: string
  price: string
  originalPrice?: string | null
  rating: number
  reviews: number
  sold: number
  image: string
  category: string
  location: string
  discount: number
  isNew: boolean
  isFavorite: boolean
}

interface Category {
  value: string
  label: string
  count: number
}

interface ProductCatalogClientProps {
  initialProducts: Product[]
  categories: Category[]
}

export default function ProductCatalogClient({ initialProducts, categories }: ProductCatalogClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.business.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category.toLowerCase() === selectedCategory)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.isNew ? 1 : -1
        case "popular":
          return b.sold - a.sold
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return Number.parseFloat(a.price.replace(/[^\d]/g, "")) - Number.parseFloat(b.price.replace(/[^\d]/g, ""))
        case "price-high":
          return Number.parseFloat(b.price.replace(/[^\d]/g, "")) - Number.parseFloat(a.price.replace(/[^\d]/g, ""))
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategory, sortBy])

  // Simulate loading more products (for ISR demonstration)
  const loadMoreProducts = async () => {
    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app, this would fetch more products from API
    // For demo, we'll just show loading state
    setLoading(false)
    setHasMore(false) // No more products to load in demo
  }

  // Auto-refresh products every 60 seconds (ISR simulation)
  useEffect(() => {
    const interval = setInterval(async () => {
      // In real app, this would check for updated products
      console.log("ISR: Checking for product updates...")
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">Si-UMKM</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-primary font-medium">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Produk UMKM</h1>
          <p className="text-gray-600">Temukan produk berkualitas dari UMKM terpercaya di seluruh Indonesia</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              ISR Enabled - Updated setiap 60 detik
            </Badge>
            <span>Total: {products.length.toLocaleString()} produk</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari produk atau nama UMKM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label} ({category.count.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="popular">Terpopuler</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredProducts.length} produk
            {selectedCategory !== "all" && (
              <span> dalam kategori "{categories.find((c) => c.value === selectedCategory)?.label}"</span>
            )}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
                )}
                {product.isNew && (
                  <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">Baru</Badge>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  style={{ display: product.isNew ? "none" : "flex" }}
                >
                  <Heart className={`h-4 w-4 ${product.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                </div>
                <CardTitle className="text-sm line-clamp-2 h-10">{product.name}</CardTitle>
                <CardDescription className="text-xs">{product.business}</CardDescription>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {product.location}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{product.sold} terjual</p>
                  <Link href={`/products/${product.id}`}>
                  <Button size="sm" className="w-full">
                        Lihat Detail
                  </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Produk tidak ditemukan</h3>
            <p className="text-gray-600 mb-4">Coba ubah kata kunci pencarian atau filter kategori</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && hasMore && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={loadMoreProducts} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memuat...
                </>
              ) : (
                "Muat Lebih Banyak"
              )}
            </Button>
          </div>
        )}

        {/* ISR Info */}
        <div className="mt-16 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🚀 Incremental Static Regeneration (ISR)</h3>
          <p className="text-blue-800 text-sm">
            Halaman ini menggunakan ISR dengan revalidasi setiap 60 detik. Produk baru akan muncul secara otomatis tanpa
            perlu rebuild aplikasi. Data di-cache untuk performa optimal namun tetap up-to-date.
          </p>
        </div>
      </div>
    </div>
  )
}
