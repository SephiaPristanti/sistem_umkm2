import type { Metadata } from "next"
import ProductCatalogClient from "@/components/products/product-catalog-client"

// Mock data fetching function
async function getProducts() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return [
    {
      id: "1",
      name: "Fudgy Brownies",
      business: "Sweet Bites",
      price: "Rp 98.400",
      originalPrice: "Rp 120.000",
      rating: 4.8,
      reviews: 100,
      sold: 90,
      image: "/Browni.jpg?height=250&width=250",
      category: "Makanan",
      location: "Purwokerto",
      discount: 18,
      isNew: false,
      isFavorite: false,
    },
    {
      id: "2",
      name: "Tas Rajut Handmade Premium",
      business: "Rajut Cantik",
      price: "Rp 85.000",
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      sold: 70,
      image: "/rajut.jpg?height=250&width=250",
      category: "Kerajinan",
      location: "Solo",
      discount: 0,
      isNew: true,
      isFavorite: true,
    },
    {
      id: "3",
      name: "Smoothie",
      business: "Fruity Vibes",
      price: "Rp 36.000",
      originalPrice: "Rp 40.000",
      rating: 4.7,
      reviews: 90,
      sold: 50,
      image: "/smoothie.jpg?height=250&width=250",
      category: "Minuman",
      location: "Purwokerto",
      discount: 10,
      isNew: false,
      isFavorite: false,
    },
    {
      id: "4",
      name: "Baju Batik",
      business: "Batik Heritage",
      price: "Rp 150.000",
      originalPrice: null,
      rating: 4.9,
      reviews: 67,
      sold: 40,
      image: "/batik.jpg?height=250&width=250",
      category: "Fashion",
      location: "Solo",
      discount: 0,
      isNew: false,
      isFavorite: false,
    },
    
    {
      id: "5",
      name: "Sepatu Kulit Handmade",
      business: "Leather Craft",
      price: "Rp 250.000",
      originalPrice: null,
      rating: 4.6,
      reviews: 50,
      sold: 35,
      image: "/sepatu.jpg?height=250&width=250",
      category: "Fashion",
      location: "Cibaduyut",
      discount: 0,
      isNew: false,
      isFavorite: false,
    },
  ]
}

async function getCategories() {
  return [
    { value: "all", label: "Semua Kategori", count: 15000 },
    { value: "makanan", label: "Makanan & Minuman", count: 5200 },
    { value: "fashion", label: "Fashion & Tekstil", count: 3800 },
    { value: "kerajinan", label: "Kerajinan Tangan", count: 2900 },
    { value: "pertanian", label: "Pertanian", count: 1800 },
    { value: "teknologi", label: "Teknologi", count: 900 },
    { value: "jasa", label: "Jasa & Layanan", count: 400 },
  ]
}

export const metadata: Metadata = {
  title: "Katalog Produk UMKM | Si-UMKM",
  description:
    "Temukan produk berkualitas dari UMKM terpercaya. Ratusan produk dari berbagai kategori dengan harga terjangkau.",
  keywords: ["UMKM", "produk lokal", "katalog", "marketplace"],
  openGraph: {
    title: "Katalog Produk UMKM | Si-UMKM",
    description: "Temukan produk berkualitas dari UMKM terpercaya.",
    type: "website",
  },
}

// Incremental Static Regeneration (ISR) - Static with periodic updates
export default async function ProductCatalogPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return <ProductCatalogClient initialProducts={products} categories={categories} />
}

// Enable ISR with 60 second revalidation
export const revalidate = 60
