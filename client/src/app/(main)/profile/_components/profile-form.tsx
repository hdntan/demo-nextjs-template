'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useAccount, useUpdateAccount } from '@/hooks/use-account'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { User } from '@/types/auth'

const profileSchema = z.object({
  name: z.string().min(1, 'Name required'),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  initialData: User
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { account, mutate } = useAccount(initialData)
  const { update, isLoading } = useUpdateAccount()
  const setUser = useAuthStore((s) => s.setUser)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: initialData.name },
  })

  async function onSubmit(data: ProfileFormData) {
    try {
      setError(null)
      setSuccess(false)
      const updated = await update(data)
      await mutate(updated, false)
      setUser(updated)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <Card className="max-w-md">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{account?.email ?? initialData.email}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Name</label>
            <Input type="text" className="mt-1" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">Profile updated.</p>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
