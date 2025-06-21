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
import { Search, Filter, ShoppingBag, Calendar, Users, MapPin, Clock, Building, Loader2 } from "lucide-react"

const SEARCH_PROGRAMS = gql`
  query SearchPrograms(
    $query: String
    $filter: ProgramFilter
    $limit: Int
    $offset: Int
  ) {
    searchPrograms(
      query: $query
      filter: $filter
      limit: $limit
      offset: $offset
    ) {
      programs {
        id
        title
        description
        organizer
        category
        type
        status
        startDate
        endDate
        duration
        participants
        registered
        location
        mode
        price
        image
      }
      total
      hasMore
    }
  }
`

export default function ProgramSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 20

  const { loading, error, data, refetch } = useQuery(SEARCH_PROGRAMS, {
    variables: {
      query: searchQuery || undefined,
      filter: {
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      },
      limit,
      offset: (currentPage - 1) * limit,
    },
  })

  const categories = [
    { value: "all", label: "Semua Kategori" },
    { value: "Digital Marketing", label: "Digital Marketing" },
    { value: "Keuangan", label: "Keuangan" },
    { value: "E-commerce", label: "E-commerce" },
    { value: "Inkubasi", label: "Inkubasi" },
    { value: "Ekspor", label: "Ekspor" },
    { value: "Branding", label: "Branding" },
  ]

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "Pendaftaran Dibuka", label: "Pendaftaran Dibuka" },
    { value: "Segera Dibuka", label: "Segera Dibuka" },
    { value: "Seleksi Berlangsung", label: "Seleksi Berlangsung" },
    { value: "Selesai", label: "Selesai" },
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
  }, [searchQuery, selectedCategory, selectedStatus])

  const programs = data?.searchPrograms?.programs || []
  const total = data?.searchPrograms?.total || 0
  const hasMore = data?.searchPrograms?.hasMore || false

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendaftaran Dibuka":
        return "bg-green-500 hover:bg-green-600"
      case "Segera Dibuka":
        return "bg-blue-500 hover:bg-blue-600"
      case "Seleksi Berlangsung":
        return "bg-orange-500 hover:bg-orange-600"
      case "Selesai":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

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
              <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">
                Produk
              </Link>
              <Link href="/programs" className="text-primary font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pencarian Program Pelatihan</h1>
          <p className="text-gray-600">Temukan program pelatihan dengan pencarian dinamis GraphQL</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari program pelatihan..."
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Mencari program...</span>
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
              Menampilkan {programs.length} dari {total} program
              {searchQuery && <span> untuk "{searchQuery}"</span>}
            </p>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Powered by GraphQL
            </Badge>
          </div>
        )}

        {/* Programs Grid */}
        {!loading && !error && programs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programs.map((program: any) => (
              <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
                    <Badge variant="outline">{program.type}</Badge>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{program.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{program.organizer}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 line-clamp-3">{program.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(program.startDate).toLocaleDateString("id-ID")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{program.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>
                        {program.registered}/{program.participants} peserta
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">{program.price}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/programs/${program.id}`}>
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        disabled={program.status === "Selesai" || program.registered >= program.participants}
                      >
                        {program.status === "Selesai"
                          ? "Selesai"
                          : program.registered >= program.participants
                            ? "Penuh"
                            : "Daftar"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && programs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Program tidak ditemukan</h3>
            <p className="text-gray-600 mb-4">Coba ubah kata kunci pencarian atau filter kategori</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedStatus("all")
                setCurrentPage(1)
              }}
            >
              Reset Pencarian
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && programs.length > 0 && (
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
