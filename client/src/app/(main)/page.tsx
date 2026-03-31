// RSC — fetches product list server-side, hydrates client SWR
import { createServerApiClient } from '@/lib/api/server'
import { listProducts } from '@/lib/api/services/product.service'
import { ProductsCatalog } from './_components/products-catalog'
import type { Product } from '@/types/product'

export default async function HomePage() {
  const api = await createServerApiClient()

  let products: Product[] = []
  try {
    products = await listProducts(api)
  } catch {
    // API unavailable — render empty state; SWR will retry on client
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Products</h1>
      <ProductsCatalog initialData={products} />
    </div>
  )
}
