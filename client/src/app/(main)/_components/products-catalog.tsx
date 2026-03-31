'use client'

import { useProducts } from '@/hooks/use-products'
import { Shelf } from '@/components/shelf'
import { ProductCard } from '@/components/product'
import type { Product } from '@/types/product'

interface ProductsCatalogProps {
  initialData: Product[]
}

export function ProductsCatalog({ initialData }: ProductsCatalogProps) {
  const { products, isLoading, error } = useProducts(initialData)

  if (isLoading && products.length === 0) {
    return null
  }

  if (!isLoading && products.length === 0) {
    return <p className="text-muted-foreground text-sm">No products found.</p>
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-muted-foreground">
          Could not refresh data. Showing last known results.
        </p>
      )}
      <Shelf variant="grid-3" title="Products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Shelf>
    </div>
  )
}
