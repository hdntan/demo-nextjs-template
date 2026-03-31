// RSC — fetches product by ID, hydrates client SWR
import { createServerApiClient } from '@/lib/api/server'
import { getProduct } from '@/lib/api/services/product.service'
import { ProductDetail } from './_components/product-detail'
import { notFound } from 'next/navigation'
import { ApiError } from '@/lib/net/net'
import type { Product } from '@/types/product'

interface DetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params
  const id = parseInt(slug, 10)

  if (isNaN(id)) notFound()

  const api = await createServerApiClient()

  let product: Product
  try {
    product = await getProduct(api, id)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound()
    throw err
  }

  return <ProductDetail initialData={product} />
}
