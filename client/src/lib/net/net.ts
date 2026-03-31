import { generateCorrelationId } from './correlation'
import { CORRELATION_ID_HEADER } from '@/config/constants'
import { AUTH_BYPASS } from '@/config/flags'

export interface NetOptions {
  token?: string
  correlationId?: string
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly correlationId?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── Core fetch ──────────────────────────────────────────────────────────────

export async function netFetch<T>(
  url: string,
  init: RequestInit = {},
  options: NetOptions = {}
): Promise<T> {
  const headers = new Headers(init.headers)

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  headers.set(CORRELATION_ID_HEADER, options.correlationId ?? generateCorrelationId())

  // Only set Content-Type when a body is present (GET/DELETE have no body)
  if (init.body !== undefined && init.body !== null) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, { ...init, headers })

  if (!response.ok) {
    // On 401 in browser: session expired — redirect to login
    if (response.status === 401 && typeof window !== 'undefined') {
      if (!AUTH_BYPASS) window.location.href = '/login'
      throw new ApiError(401, 'Session expired', headers.get(CORRELATION_ID_HEADER) ?? undefined)
    }

    const body = (await response.json().catch(() => ({ message: response.statusText }))) as {
      message?: string
    }
    throw new ApiError(
      response.status,
      body.message ?? response.statusText,
      headers.get(CORRELATION_ID_HEADER) ?? undefined
    )
  }

  return response.json() as Promise<T>
}
