// Server-side auth service — use in Route Handlers or Server Actions only.
// For client-side auth actions, use the BFF routes via useAuth() hook.
import type { ApiClient } from '@/lib/api/types'
import type { User } from '@/types/auth'

export interface AuthSession {
  token: string
  expiresAt: string
  user: User
}

interface BackendAuthRes {
  data: { token: string; expiresAt: string; account: { id: number; name: string; email: string } }
  message: string
}

function toSession(res: BackendAuthRes): AuthSession {
  return {
    token: res.data.token,
    expiresAt: res.data.expiresAt,
    user: res.data.account,
  }
}

export interface RegisterBody {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginBody {
  email: string
  password: string
}

export async function register(api: ApiClient, body: RegisterBody): Promise<AuthSession> {
  const res = await api.post<BackendAuthRes>('/auth/register', body)
  return toSession(res)
}

export async function login(api: ApiClient, body: LoginBody): Promise<AuthSession> {
  const res = await api.post<BackendAuthRes>('/auth/login', body)
  return toSession(res)
}

export async function logout(api: ApiClient): Promise<void> {
  await api.post<{ message: string }>('/auth/logout')
}

export async function slideSession(api: ApiClient): Promise<AuthSession> {
  const res = await api.post<BackendAuthRes>('/auth/slide-session')
  return toSession(res)
}
