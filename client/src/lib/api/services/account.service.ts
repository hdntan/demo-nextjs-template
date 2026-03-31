import type { ApiClient } from '@/lib/api/types'
import type { User } from '@/types/auth'

interface AccountRes {
  data: { id: number; name: string; email: string }
  message: string
}

export async function getMe(api: ApiClient): Promise<User> {
  const res = await api.get<AccountRes>('/account/me')
  return res.data
}

export async function updateMe(api: ApiClient, body: { name: string }): Promise<User> {
  const res = await api.put<AccountRes>('/account/me', body)
  return res.data
}
