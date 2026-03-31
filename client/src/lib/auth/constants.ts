export const ACCESS_TOKEN = 'access_token'

// Session token max age — matches backend session sliding window
export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const IS_PROD = process.env.NODE_ENV === 'production'

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: ACCESS_TOKEN_MAX_AGE,
}
