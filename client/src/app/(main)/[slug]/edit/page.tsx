import { createServerApiClient } from '@/lib/api/server'
import { getProduct } from '@/lib/api/services/product.service'
import { getMe } from '@/lib/api/services/account.service'
import { redirect, notFound } from 'next/navigation'
import { ApiError } from '@/lib/net/net'
import { EditProductForm } from './_components/edit-product-form'
import type { Product } from '@/types/product'

interface EditPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditProductPage({ params }: EditPageProps) {
  const { slug } = await params
  const id = parseInt(slug, 10)
  if (isNaN(id)) notFound()

  const api = await createServerApiClient()

  try {
    await getMe(api)
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect('/login')
    throw err
  }

  let product: Product
  try {
    product = await getProduct(api, id)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound()
    throw err
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <EditProductForm product={product} />
    </div>
  )
}
