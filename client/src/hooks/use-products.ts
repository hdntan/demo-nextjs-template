'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { KEYS } from './keys'
import { createClientApiClient } from '@/lib/api/client'
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/api/services/product.service'
import type { Product, CreateProductBody, UpdateProductBody } from '@/types/product'

// ─── Read hooks (RSC hydration pattern) ─────────────────────────────────────

export function useProducts(initialData?: Product[]) {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    KEYS.products.list,
    () => listProducts(createClientApiClient()),
    { fallbackData: initialData, revalidateOnFocus: false }
  )

  return { products: data ?? [], isLoading, error, mutate }
}

export function useProduct(id: number, initialData?: Product) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    KEYS.products.detail(id),
    () => getProduct(createClientApiClient(), id),
    { fallbackData: initialData, revalidateOnFocus: false }
  )

  return { product: data ?? null, isLoading, error, mutate }
}

// ─── Mutation hooks ──────────────────────────────────────────────────────────

export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function create(body: CreateProductBody): Promise<Product> {
    setIsLoading(true)
    setError(null)
    try {
      const product = await createProduct(createClientApiClient(), body)
      return product
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Create failed')
      setError(e)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return { create, isLoading, error }
}

export function useUpdateProduct() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function update(id: number, body: UpdateProductBody): Promise<Product> {
    setIsLoading(true)
    setError(null)
    try {
      const product = await updateProduct(createClientApiClient(), id, body)
      return product
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Update failed')
      setError(e)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return { update, isLoading, error }
}

export function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function remove(id: number): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await deleteProduct(createClientApiClient(), id)
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Delete failed')
      setError(e)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return { remove, isLoading, error }
}
