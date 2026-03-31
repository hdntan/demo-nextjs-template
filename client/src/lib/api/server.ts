// ONLY import this file in RSC / Server Actions / Route Handlers.
// Reads the access_token HttpOnly cookie and injects it as a Bearer token
// for direct calls to the external API (no proxy hop needed server-side).
import { cookies } from 'next/headers'
import { buildApiClient } from './builder'
import { env } from '@/config/env'
import { ACCESS_TOKEN, ACCESS_COOKIE_OPTIONS } from '@/lib/auth/constants'
import { isTokenExpired } from '@/lib/auth/jwt'
import type { ApiClient } from './types'

interface BackendAuthRes {
  data: { token: string; expiresAt: string }
  message: string
}

export async function createServerApiClient(): Promise<ApiClient> {
  const cookieStore = await cookies()
  let token = cookieStore.get(ACCESS_TOKEN)?.value

  // Proactive expiry check — slide the session before making the API call
  // rather than handling a 401 after.
  if (token && isTokenExpired(token)) {
    try {
      const res = await fetch(`${env.API_URL}/auth/slide-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = (await res.json()) as BackendAuthRes
        token = data.data.token

        // Route Handlers / Server Actions: persist new cookie.
        // RSC (page.tsx): cookies().set() throws — caught below.
        // New token is used in-memory for this render.
        try {
          cookieStore.set(ACCESS_TOKEN, token, ACCESS_COOKIE_OPTIONS)
        } catch {
          // RSC context — silently continue with in-memory token
        }
      } else if (res.status === 401) {
        // Session is expired/invalidated — clear the cookie so subsequent
        // renders don't attempt another slide.
        token = undefined
        try {
          cookieStore.delete(ACCESS_TOKEN)
        } catch {
          // RSC context — cannot delete cookies; they'll expire naturally
        }
      }
      // For 5xx / other errors: keep the existing token and let the API call
      // surface the error rather than silently logging the user out.
    } catch (err) {
      console.error('[createServerApiClient] Session slide failed:', err)
    }
  }

  return buildApiClient({ token, baseUrl: env.API_URL })
}
