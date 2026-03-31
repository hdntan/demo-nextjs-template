import type { ApiClient } from '@/lib/api/types'
import type { Product, CreateProductBody, UpdateProductBody } from '@/types/product'

interface ProductRes {
  data: Product
  message: string
}

interface ProductListRes {
  data: Product[]
  message: string
}

export async function listProducts(api: ApiClient): Promise<Product[]> {
  const res = await api.get<ProductListRes>('/products')
  return res.data
}

export async function getProduct(api: ApiClient, id: number): Promise<Product> {
  const res = await api.get<ProductRes>(`/products/${id}`)
  return res.data
}

export async function createProduct(api: ApiClient, body: CreateProductBody): Promise<Product> {
  const res = await api.post<ProductRes>('/products', body)
  return res.data
}

export async function updateProduct(
  api: ApiClient,
  id: number,
  body: UpdateProductBody
): Promise<Product> {
  const res = await api.put<ProductRes>(`/products/${id}`, body)
  return res.data
}

export async function deleteProduct(api: ApiClient, id: number): Promise<void> {
  await api.delete<{ message: string }>(`/products/${id}`)
}
