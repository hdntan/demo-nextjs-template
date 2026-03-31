'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUpdateProduct, useDeleteProduct } from '@/hooks/use-products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/ui/image-upload'
import type { Product } from '@/types/product'

const editProductSchema = z.object({
  name: z.string().min(1, 'Name required'),
  price: z.number().min(0, 'Price must be non-negative'),
  description: z.string().min(1, 'Description required'),
  image: z.string().min(1, 'Image required'),
})

type EditProductFormData = z.infer<typeof editProductSchema>

interface EditProductFormProps {
  product: Product
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()
  const { update, isLoading: isUpdating } = useUpdateProduct()
  const { remove, isLoading: isDeleting } = useDeleteProduct()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    },
  })

  async function onSubmit(data: EditProductFormData) {
    try {
      setError(null)
      await update(product.id, data)
      router.push(`/${product.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    try {
      setError(null)
      await remove(product.id)
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">Product Image</label>
        <Controller
          control={control}
          name="image"
          render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
        />
        {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">Name</label>
        <Input type="text" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">Price (VND)</label>
        <Input type="number" min={0} {...register('price', { valueAsNumber: true })} />
        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">Description</label>
        <textarea
          className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 flex-wrap">
        <Button type="submit" disabled={isUpdating || isDeleting}>
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(`/${product.id}`)} disabled={isUpdating || isDeleting}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isUpdating || isDeleting}
          className="ml-auto"
        >
          {isDeleting ? 'Deleting...' : 'Delete Product'}
        </Button>
      </div>
    </form>
  )
}
