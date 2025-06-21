"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Star, ShoppingBag, MapPin, Phone, Mail, Heart, Share2, MessageCircle, ThumbsUp, Store } from "lucide-react"

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    business: string
    price: string
    originalPrice?: string | null
    rating: number
    reviews: number
    sold: number
    images: string[]
    category: string
    location: string
    discount: number
    description: string
    specifications: Array<{ label: string; value: string }>
    businessInfo: {
      name: string
      owner: string
      established: string
      address: string
      phone: string
      email: string
      description: string
    }
  }
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(0)

  const reviews = [
    {
      id: 1,
      user: "Andi Pratama",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 hari yang lalu",
      comment: "Produknya sangat bagus! Kualitas sesuai dengan harga, pasti beli lagi!",
      helpful: 12,
      images: ["/placeholder.svg?height=100&width=100"],
    },
    {
      id: 2,
      user: "Maya Sari",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "1 minggu yang lalu",
      comment: "Kualitas premium, packaging rapi, pengiriman cepat. Recommended!",
      helpful: 8,
      images: [],
    },
  ]

  const ratingDistribution = [
    { stars: 5, count: 89, percentage: 72 },
    { stars: 4, count: 25, percentage: 20 },
    { stars: 3, count: 7, percentage: 6 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 1, percentage: 1 },
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
          <Link href="/products" className="hover:text-primary">
            Produk
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4 mr-1" />
                    Favorit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-4 w-4 mr-1" />
                    Bagikan
                  </Button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <Link href={`/business/${product.business}`} className="text-primary hover:underline font-medium">
                {product.business}
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} ulasan)</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-1 text-gray-500">
                <span>{product.sold} terjual</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-1 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
                    <Badge className="bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Deskripsi Produk</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Spesifikasi</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{spec.label}:</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button size="lg" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Hubungi Penjual
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                Kunjungi Toko
              </Button>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Informasi UMKM</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{product.businessInfo.name}</h3>
                  <p className="text-gray-600">Pemilik: {product.businessInfo.owner}</p>
                  <p className="text-gray-600">Berdiri sejak: {product.businessInfo.established}</p>
                </div>
                <p className="text-gray-600">{product.businessInfo.description}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{product.businessInfo.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{product.businessInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{product.businessInfo.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ulasan Pelanggan</CardTitle>
            <CardDescription>
              Berdasarkan {product.reviews} ulasan dari pelanggan yang telah membeli produk ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{product.rating}</div>
                <div className="flex justify-center items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{product.reviews} ulasan</p>
              </div>
              <div className="space-y-2">
                {ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm">{rating.stars}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <Progress value={rating.percentage} className="flex-1" />
                    <span className="text-sm text-gray-600 w-8">{rating.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage src={review.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{review.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{review.user}</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{review.comment}</p>
                      {review.images.length > 0 && (
                        <div className="flex space-x-2 mb-2">
                          {review.images.map((image, index) => (
                            <Image
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt="Review"
                              width={64}
                              height={64}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Membantu ({review.helpful})
                      </Button>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>

            {/* Add Review */}
            <div className="space-y-4">
              <h3 className="font-semibold">Tulis Ulasan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setNewRating(star)} className="focus:outline-none">
                        <Star
                          className={`h-6 w-6 ${
                            star <= newRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ulasan</label>
                  <Textarea
                    placeholder="Bagikan pengalaman Anda dengan produk ini..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button disabled={!newRating || !newReview.trim()}>Kirim Ulasan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
