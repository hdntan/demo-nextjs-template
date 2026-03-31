'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { KEYS } from './keys'
import { createClientApiClient } from '@/lib/api/client'
import { getMe, updateMe } from '@/lib/api/services/account.service'
import type { User } from '@/types/auth'

export function useAccount(initialData?: User) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    KEYS.account.me,
    () => getMe(createClientApiClient()),
    { fallbackData: initialData, revalidateOnFocus: false }
  )

  return { account: data ?? null, isLoading, error, mutate }
}

export function useUpdateAccount() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function update(body: { name: string }): Promise<User> {
    setIsLoading(true)
    setError(null)
    try {
      const account = await updateMe(createClientApiClient(), body)
      return account
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
