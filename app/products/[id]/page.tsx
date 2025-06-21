import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ProductDetailClient from "@/components/products/product-detail-client"
import { getProduct, getAllProductIds } from "./product-utils"

// Generate static params for SSG
export async function generateStaticParams() {
  const products = await getAllProductIds()

  return products.map((product) => ({
    id: product.id,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found | Si-UMKM",
    }
  }

  return {
    title: `${product.name} - ${product.business} | Si-UMKM`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images,
    },
  }
}

// Static Site Generation (SSG) - Pre-rendered at build time
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}

// Enable static generation
export const dynamic = "auto"
export const revalidate = false // Static until manually revalidated
