"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  ShoppingBag,
  Calendar,
  Users,
  MapPin,
  BookOpen,
  Clock,
  Building,
  GraduationCap,
} from "lucide-react"

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const programs = [
    {
      id: 1,
      title: "Pelatihan Digital Marketing untuk UMKM",
      organizer: "Kementerian Koperasi dan UKM",
      category: "Digital Marketing",
      type: "Pelatihan",
      status: "Pendaftaran Dibuka",
      startDate: "15 Januari 2025",
      endDate: "17 Januari 2025",
      duration: "3 hari",
      participants: 50,
      registered: 32,
      location: "Jakarta",
      mode: "Hybrid",
      price: "Gratis",
      description:
        "Program pelatihan komprehensif untuk meningkatkan kemampuan digital marketing UMKM, meliputi social media marketing, content creation, dan online advertising.",
      benefits: [
        "Sertifikat resmi dari Kemenkop UKM",
        "Modul pelatihan digital",
        "Konsultasi bisnis gratis",
        "Networking dengan UMKM lain",
      ],
      requirements: ["Memiliki usaha UMKM aktif", "Laptop/smartphone untuk praktik", "Komitmen mengikuti full program"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Workshop Manajemen Keuangan UMKM",
      organizer: "Bank Indonesia",
      category: "Keuangan",
      type: "Workshop",
      status: "Segera Dibuka",
      startDate: "22 Januari 2025",
      endDate: "24 Januari 2025",
      duration: "3 hari",
      participants: 30,
      registered: 0,
      location: "Surabaya",
      mode: "Offline",
      price: "Gratis",
      description:
        "Workshop intensif untuk meningkatkan kemampuan manajemen keuangan UMKM, termasuk pembukuan, perencanaan keuangan, dan akses permodalan.",
      benefits: [
        "Sertifikat dari Bank Indonesia",
        "Template pembukuan UMKM",
        "Konsultasi keuangan gratis",
        "Akses ke program kredit UMKM",
      ],
      requirements: [
        "UMKM dengan omzet minimal 50 juta/tahun",
        "Membawa dokumen keuangan usaha",
        "Laptop untuk praktik",
      ],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Pelatihan E-commerce dan Marketplace",
      organizer: "Kadin Indonesia",
      category: "E-commerce",
      type: "Pelatihan",
      status: "Pendaftaran Dibuka",
      startDate: "1 Februari 2025",
      endDate: "3 Februari 2025",
      duration: "3 hari",
      participants: 40,
      registered: 15,
      location: "Bandung",
      mode: "Hybrid",
      price: "Rp 150.000",
      description:
        "Pelatihan praktis untuk memulai dan mengoptimalkan penjualan di platform e-commerce dan marketplace populer di Indonesia.",
      benefits: [
        "Sertifikat Kadin Indonesia",
        "Panduan lengkap e-commerce",
        "Template toko online",
        "Mentoring 1 bulan",
      ],
      requirements: ["Memiliki produk untuk dijual online", "Smartphone/laptop", "Email aktif"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Program Inkubasi Startup UMKM",
      organizer: "Kementerian Perindustrian",
      category: "Inkubasi",
      type: "Program",
      status: "Seleksi Berlangsung",
      startDate: "15 Februari 2025",
      endDate: "15 Mei 2025",
      duration: "3 bulan",
      participants: 20,
      registered: 45,
      location: "Jakarta",
      mode: "Offline",
      price: "Gratis",
      description:
        "Program inkubasi intensif untuk UMKM yang ingin berkembang menjadi startup dengan model bisnis yang scalable dan sustainable.",
      benefits: [
        "Mentoring dari expert",
        "Seed funding hingga 100 juta",
        "Akses ke investor",
        "Networking startup ecosystem",
      ],
      requirements: ["Proposal bisnis yang inovatif", "Tim minimal 2 orang", "Komitmen full-time 3 bulan"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "Pelatihan Ekspor untuk UMKM",
      organizer: "Kementerian Perdagangan",
      category: "Ekspor",
      type: "Pelatihan",
      status: "Pendaftaran Dibuka",
      startDate: "10 Februari 2025",
      endDate: "12 Februari 2025",
      duration: "3 hari",
      participants: 35,
      registered: 8,
      location: "Medan",
      mode: "Offline",
      price: "Gratis",
      description:
        "Pelatihan komprehensif untuk UMKM yang ingin mengembangkan bisnis ke pasar ekspor, meliputi regulasi, dokumentasi, dan strategi pemasaran internasional.",
      benefits: [
        "Sertifikat Kemendag",
        "Panduan ekspor lengkap",
        "Koneksi buyer internasional",
        "Konsultasi ekspor gratis",
      ],
      requirements: ["Produk dengan potensi ekspor", "Dokumen legalitas lengkap", "Kemampuan bahasa Inggris dasar"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "Workshop Branding dan Packaging",
      organizer: "Bekraf Creative Economy",
      category: "Branding",
      type: "Workshop",
      status: "Selesai",
      startDate: "5 Januari 2025",
      endDate: "7 Januari 2025",
      duration: "3 hari",
      participants: 25,
      registered: 25,
      location: "Yogyakarta",
      mode: "Offline",
      price: "Rp 200.000",
      description:
        "Workshop kreatif untuk meningkatkan brand awareness dan desain packaging yang menarik untuk produk UMKM.",
      benefits: ["Sertifikat Bekraf", "Template desain branding", "Konsultasi desain gratis", "Portfolio branding"],
      requirements: ["Produk fisik yang sudah ada", "Laptop untuk desain", "Foto produk berkualitas"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const categories = [
    { value: "all", label: "Semua Kategori" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "keuangan", label: "Keuangan" },
    { value: "e-commerce", label: "E-commerce" },
    { value: "inkubasi", label: "Inkubasi" },
    { value: "ekspor", label: "Ekspor" },
    { value: "branding", label: "Branding" },
  ]

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "open", label: "Pendaftaran Dibuka" },
    { value: "soon", label: "Segera Dibuka" },
    { value: "selection", label: "Seleksi Berlangsung" },
    { value: "closed", label: "Selesai" },
  ]

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || program.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "open" && program.status === "Pendaftaran Dibuka") ||
      (selectedStatus === "soon" && program.status === "Segera Dibuka") ||
      (selectedStatus === "selection" && program.status === "Seleksi Berlangsung") ||
      (selectedStatus === "closed" && program.status === "Selesai")
    return matchesSearch && matchesCategory && matchesStatus
  })

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

  const stats = [
    {
      title: "Total Program",
      value: "150+",
      icon: BookOpen,
      description: "Program pelatihan tersedia",
    },
    {
      title: "UMKM Terlatih",
      value: "5,000+",
      description: "UMKM telah mengikuti program",
    },
    {
      title: "Mitra Pelatihan",
      value: "25+",
      description: "Lembaga dan institusi mitra",
    },
    {
      title: "Tingkat Keberhasilan",
      value: "85%",
      description: "UMKM meningkat setelah pelatihan",
    },
  ]

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Program Pelatihan & Pembinaan UMKM</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tingkatkan kemampuan bisnis Anda dengan program pelatihan berkualitas dari pemerintah dan mitra terpercaya
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">{stat.title}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Menampilkan {filteredPrograms.length} program pelatihan</p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPrograms.map((program) => (
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
                    <span>{program.startDate}</span>
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

        {/* Empty State */}
        {filteredPrograms.length === 0 && (
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
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-primary rounded-2xl p-8 text-white text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Ingin Program Pelatihan Khusus?</h2>
          <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
            Hubungi kami untuk mendiskusikan kebutuhan pelatihan khusus untuk UMKM Anda atau komunitas bisnis Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Hubungi Kami
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Lihat FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
