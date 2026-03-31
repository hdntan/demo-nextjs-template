export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  createdAt: string
  updatedAt: string
}

export interface CreateProductBody {
  name: string
  price: number
  description: string
  image: string
}

export type UpdateProductBody = CreateProductBody
