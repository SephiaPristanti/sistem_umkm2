"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, Filter, ShoppingBag, MapPin, Heart, Loader2 } from "lucide-react"

const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $query: String
    $filter: ProductFilter
    $sort: ProductSort
    $limit: Int
    $offset: Int
  ) {
    searchProducts(
      query: $query
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
    ) {
      products {
        id
        name
        price
        originalPrice
        rating
        reviewCount
        sold
        images
        category
        location
        discount
        business {
          id
          name
        }
      }
      total
      hasMore
    }
  }
`

export default function ProductSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 20

  const { loading, error, data, refetch } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      query: searchQuery || undefined,
      filter: {
        category: selectedCategory !== "all" ? selectedCategory : undefined,
      },
      sort: {
        field: sortBy === "newest" ? "createdAt" : sortBy === "price-low" ? "price" : "rating",
        direction: sortBy === "price-low" ? "ASC" : "DESC",
      },
      limit,
      offset: (currentPage - 1) * limit,
    },
  })

  const categories = [
    { value: "all", label: "Semua Kategori" },
    { value: "Makanan", label: "Makanan & Minuman" },
    { value: "Fashion", label: "Fashion & Tekstil" },
    { value: "Kerajinan", label: "Kerajinan Tangan" },
    { value: "Pertanian", label: "Pertanian" },
    { value: "Teknologi", label: "Teknologi" },
    { value: "Jasa", label: "Jasa & Layanan" },
  ]

  const handleSearch = () => {
    setCurrentPage(1)
    refetch()
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategory, sortBy])

  const products = data?.searchProducts?.products || []
  const total = data?.searchProducts?.total || 0
  const hasMore = data?.searchProducts?.hasMore || false

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pencarian Produk UMKM</h1>
          <p className="text-gray-600">Temukan produk berkualitas dengan pencarian dinamis GraphQL</p>
        </div>

        {/* Search Filters */}
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
                      {category.label}
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
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Mencari produk...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>Coba Lagi</Button>
          </div>
        )}

        {/* Results Info */}
        {!loading && !error && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Menampilkan {products.length} dari {total} produk
              {searchQuery && <span> untuk "{searchQuery}"</span>}
            </p>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Powered by GraphQL
            </Badge>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
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
                      <span className="text-xs text-gray-500">({product.reviewCount})</span>
                    </div>
                  </div>
                  <CardTitle className="text-sm line-clamp-2 h-10">{product.name}</CardTitle>
                  <CardDescription className="text-xs">{product.business.name}</CardDescription>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {product.location}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">Rp {product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          Rp {product.originalPrice.toLocaleString()}
                        </span>
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
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
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
                setCurrentPage(1)
              }}
            >
              Reset Pencarian
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && products.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-12">
            <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Sebelumnya
            </Button>
            <span className="text-gray-600">
              Halaman {currentPage} dari {Math.ceil(total / limit)}
            </span>
            <Button variant="outline" disabled={!hasMore} onClick={() => setCurrentPage(currentPage + 1)}>
              Selanjutnya
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
