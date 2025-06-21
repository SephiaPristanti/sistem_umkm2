"use client"
import ProductDetailClient from "@/components/products/product-detail-client"

import { getProduct } from "./product-utils"
import { notFound } from "next/navigation"

// Static Site Generation (SSG) - Pre-rendered at build time
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
