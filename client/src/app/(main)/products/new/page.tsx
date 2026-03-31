import { createServerApiClient } from '@/lib/api/server'
import { getMe } from '@/lib/api/services/account.service'
import { redirect } from 'next/navigation'
import { ApiError } from '@/lib/net/net'
import { CreateProductForm } from './_components/create-product-form'

export default async function NewProductPage() {
  // Require auth
  const api = await createServerApiClient()
  try {
    await getMe(api)
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect('/login')
    throw err
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Product</h1>
      <CreateProductForm />
    </div>
  )
}
