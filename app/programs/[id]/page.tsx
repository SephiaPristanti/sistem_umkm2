"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import SecureProgramRegistrationForm from "@/components/programs/secure-registration-form"
import {
  ShoppingBag,
  Calendar,
  Users,
  MapPin,
  Clock,
  Building,
  CheckCircle,
  Star,
  Shield,
  Award,
  BookOpen,
} from "lucide-react"

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  const [registrationOpen, setRegistrationOpen] = useState(false)

  // Mock program data
  const program = {
    id: 1,
    title: "Pelatihan Digital Marketing untuk UMKM",
    description:
      "Program pelatihan komprehensif untuk meningkatkan kemampuan digital marketing UMKM, meliputi social media marketing, content creation, dan online advertising.",
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
    image: "/placeholder.svg?height=400&width=600",
    benefits: [
      "Sertifikat resmi dari Kemenkop UKM",
      "Modul pelatihan digital lengkap",
      "Konsultasi bisnis gratis selama 3 bulan",
      "Networking dengan UMKM lain",
      "Akses ke komunitas digital marketing",
    ],
    requirements: [
      "Memiliki usaha UMKM aktif minimal 6 bulan",
      "Laptop/smartphone untuk praktik",
      "Komitmen mengikuti full program",
      "Memiliki produk yang akan dipasarkan",
    ],
    curriculum: [
      {
        day: "Hari 1",
        topics: ["Pengenalan Digital Marketing", "Social Media Strategy", "Content Planning"],
      },
      {
        day: "Hari 2",
        topics: ["Facebook & Instagram Marketing", "Google Ads Basics", "Analytics & Measurement"],
      },
      {
        day: "Hari 3",
        topics: ["E-commerce Integration", "Customer Engagement", "Scaling Your Business"],
      },
    ],
  }

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

  const handleRegistrationSuccess = () => {
    setRegistrationOpen(false)
    // You could also refresh the program data here to update registration count
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
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/programs" className="hover:text-primary">
            Program Pelatihan
          </Link>
          <span>/</span>
          <span className="text-gray-900">{program.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Header */}
            <div>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                <img
                  src={program.image || "/placeholder.svg"}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
                <Badge variant="outline">{program.type}</Badge>
                <Badge variant="outline">{program.category}</Badge>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{program.title}</h1>

              <div className="flex items-center space-x-1 mb-4">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{program.organizer}</span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">{program.description}</p>
            </div>

            {/* Program Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Tanggal Mulai</p>
                    <p className="font-semibold">{program.startDate}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Durasi</p>
                    <p className="font-semibold">{program.duration}</p>
                  </div>
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-semibold">{program.location}</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Peserta</p>
                    <p className="font-semibold">
                      {program.registered}/{program.participants}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Manfaat Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {program.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Persyaratan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {program.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Kurikulum Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {program.curriculum.map((day, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-lg mb-3">{day.day}</h4>
                      <ul className="space-y-2">
                        {day.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                      {index < program.curriculum.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Program</CardTitle>
                <CardDescription>Sisa {program.participants - program.registered} slot tersedia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{program.price}</div>
                  <div className="text-sm text-gray-500">Per peserta</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(program.registered / program.participants) * 100}%` }}
                  ></div>
                </div>

                <div className="text-center text-sm text-gray-600">
                  {program.registered} dari {program.participants} peserta terdaftar
                </div>

                <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={program.status === "Selesai" || program.registered >= program.participants}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {program.status === "Selesai"
                        ? "Program Selesai"
                        : program.registered >= program.participants
                          ? "Kuota Penuh"
                          : "Daftar Sekarang"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Pendaftaran Program</DialogTitle>
                    </DialogHeader>
                    <SecureProgramRegistrationForm
                      programId={params.id}
                      programTitle={program.title}
                      onSuccess={handleRegistrationSuccess}
                    />
                  </DialogContent>
                </Dialog>

                <div className="text-xs text-gray-500 text-center">
                  Pendaftaran dilindungi dengan keamanan tingkat tinggi
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Penyelenggara</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{program.organizer}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Kementerian Koperasi dan UKM adalah lembaga pemerintah yang bertanggung jawab dalam pembinaan dan
                    pengembangan koperasi serta usaha mikro, kecil, dan menengah di Indonesia.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Butuh Bantuan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Hubungi tim support kami jika ada pertanyaan tentang program ini.
                </p>
                <Button variant="outline" className="w-full">
                  Hubungi Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
