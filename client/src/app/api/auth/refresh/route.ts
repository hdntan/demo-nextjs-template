// This backend uses sliding sessions, not token rotation.
// Kept for backwards compatibility — equivalent to POST /api/auth/slide-session.
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { env } from '@/config/env'
import { ACCESS_TOKEN, ACCESS_COOKIE_OPTIONS } from '@/lib/auth/constants'

interface BackendAuthRes {
  data: { token: string; expiresAt: string; account: { id: number; name: string; email: string } }
  message: string
}

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN)?.value

  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const res = await fetch(`${env.API_URL}/auth/slide-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null)

  if (!res || !res.ok) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const data = (await res.json()) as BackendAuthRes
  cookieStore.set(ACCESS_TOKEN, data.data.token, ACCESS_COOKIE_OPTIONS)
  return NextResponse.json({ success: true })
}
