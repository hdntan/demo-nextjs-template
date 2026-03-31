'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCreateProduct } from '@/hooks/use-products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/ui/image-upload'

const createProductSchema = z.object({
  name: z.string().min(1, 'Name required'),
  price: z.number().min(0, 'Price must be non-negative'),
  description: z.string().min(1, 'Description required'),
  image: z.string().min(1, 'Image required'),
})

type CreateProductFormData = z.infer<typeof createProductSchema>

export function CreateProductForm() {
  const router = useRouter()
  const { create, isLoading } = useCreateProduct()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { name: '', price: 0, description: '', image: '' },
  })

  async function onSubmit(data: CreateProductFormData) {
    try {
      setError(null)
      const product = await create(data)
      router.push(`/${product.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
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

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Product'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
