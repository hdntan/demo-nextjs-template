'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useProduct } from '@/hooks/use-products'
import type { Product } from '@/types/product'

interface ProductDetailProps {
  initialData: Product
}

export function ProductDetail({ initialData }: ProductDetailProps) {
  const { product } = useProduct(initialData.id, initialData)

  if (!product) return null

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price)

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary">{formattedPrice}</p>
          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Added {new Date(product.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  )
}
