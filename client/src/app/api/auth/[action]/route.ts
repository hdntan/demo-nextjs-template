import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/config/env'
import { ACCESS_TOKEN, ACCESS_COOKIE_OPTIONS } from '@/lib/auth/constants'
import type { User } from '@/types/auth'

// ─── Backend response types ───────────────────────────────────────────────────

interface BackendAuthData {
  token: string
  expiresAt: string
  account: { id: number; name: string; email: string }
}

interface BackendAuthRes {
  data: BackendAuthData
  message: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function accountToUser(account: BackendAuthData['account']): User {
  return { id: account.id, email: account.email, name: account.name }
}

async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN, token, ACCESS_COOKIE_OPTIONS)
}

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handleRegister(request: NextRequest): Promise<NextResponse> {
  let body: { name?: string; email?: string; password?: string; confirmPassword?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json({ message: 'name, email, and password are required' }, { status: 400 })
  }

  const res = await fetch(`${env.API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => null)

  if (!res) return NextResponse.json({ message: 'Service unavailable' }, { status: 503 })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Registration failed' }))
    return NextResponse.json(error, { status: res.status })
  }

  const data = (await res.json()) as BackendAuthRes
  await setSessionCookie(data.data.token)
  return NextResponse.json({ user: accountToUser(data.data.account) })
}

async function handleLogin(request: NextRequest): Promise<NextResponse> {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  if (!body.email || !body.password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
  }

  const res = await fetch(`${env.API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: body.email, password: body.password }),
  }).catch(() => null)

  if (!res) return NextResponse.json({ message: 'Service unavailable' }, { status: 503 })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Invalid credentials' }))
    return NextResponse.json(error, { status: res.status })
  }

  const data = (await res.json()) as BackendAuthRes
  await setSessionCookie(data.data.token)
  return NextResponse.json({ user: accountToUser(data.data.account) })
}

async function handleLogout(): Promise<NextResponse> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN)?.value

  // Invalidate session server-side
  if (token) {
    await fetch(`${env.API_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null) // Fire-and-forget — clear cookie regardless
  }

  cookieStore.delete(ACCESS_TOKEN)
  return NextResponse.json({ success: true })
}

async function handleMe(): Promise<NextResponse> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN)?.value

  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const res = await fetch(`${env.API_URL}/account/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null)

  if (!res || !res.ok) {
    if (res?.status === 401) cookieStore.delete(ACCESS_TOKEN)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const data = (await res.json()) as { data: { id: number; name: string; email: string }; message: string }
  return NextResponse.json({ user: accountToUser(data.data) })
}

async function handleSlideSession(): Promise<NextResponse> {
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
  await setSessionCookie(data.data.token)
  return NextResponse.json({ success: true })
}

// ─── Route Exports ────────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
): Promise<NextResponse> {
  const { action } = await params
  switch (action) {
    case 'me':
      return handleMe()
    default:
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
): Promise<NextResponse> {
  const { action } = await params
  switch (action) {
    case 'register':
      return handleRegister(request)
    case 'login':
      return handleLogin(request)
    case 'logout':
      return handleLogout()
    case 'slide-session':
      return handleSlideSession()
    default:
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }
}
