import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/config/env'
import { ACCESS_TOKEN } from '@/lib/auth/constants'

type RouteContext = { params: Promise<{ path: string[] }> }

/** Reject path segments that attempt directory traversal */
function isSafePath(segments: string[]): boolean {
  return segments.every((seg) => seg !== '..' && seg !== '.' && !seg.includes('/'))
}

async function proxyRequest(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN)?.value

  // Require auth for all non-GET mutations — public GET endpoints pass through without a token
  const isWrite = request.method !== 'GET' && request.method !== 'HEAD'
  if (isWrite && !token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { path } = await context.params

  if (!isSafePath(path)) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }

  const targetUrl = `${env.API_URL}/${path.join('/')}`

  // Verify the assembled URL stays within the configured API origin (SSRF guard)
  try {
    const base = new URL(env.API_URL)
    const target = new URL(targetUrl)
    if (target.origin !== base.origin) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }

  // Forward query string if present
  const { search } = new URL(request.url)
  const url = search ? `${targetUrl}${search}` : targetUrl

  const headers: Record<string, string> = {}

  // Attach token when available (required for protected endpoints)
  if (token) headers['Authorization'] = `Bearer ${token}`

  // Forward Content-Type only when present
  const contentType = request.headers.get('Content-Type')
  if (contentType) headers['Content-Type'] = contentType

  const init: RequestInit = { method: request.method, headers }

  // Forward body as a stream to correctly handle both JSON and binary (multipart/form-data)
  if (isWrite && request.body) {
    init.body = request.body
    // Required for streaming bodies in Node.js fetch
    ;(init as RequestInit & { duplex: string }).duplex = 'half'
  }

  const res = await fetch(url, init).catch(() => null)

  if (!res) {
    return NextResponse.json({ message: 'Service unavailable' }, { status: 503 })
  }

  const resContentType = res.headers.get('Content-Type') ?? ''
  if (resContentType.includes('application/json')) {
    const data = await res.json().catch(() => null)
    return NextResponse.json(data ?? {}, { status: res.status })
  }

  // Non-JSON response (binary, plain text, etc.) — stream body directly
  return new NextResponse(res.body, {
    status: res.status,
    headers: resContentType ? { 'Content-Type': resContentType } : {},
  })
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const PATCH = proxyRequest
export const DELETE = proxyRequest
