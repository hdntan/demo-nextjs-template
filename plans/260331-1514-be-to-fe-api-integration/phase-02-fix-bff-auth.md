# Phase 02 — Fix BFF Auth Routes

**Status**: 🔴 Todo | **Priority**: High
**Depends on**: Phase 01 (User type)
**Blocks**: Phase 03

## Overview

The BFF `/api/auth/[action]/route.ts` has wrong endpoint URLs, wrong field extraction, and missing handlers. Fix to match the real backend contract.

## Files to Modify

### `client/src/app/api/auth/[action]/route.ts`

**`handleLogin` — fix response extraction:**
```
Backend returns: { data: { token, expiresAt, account: { id, name, email } }, message }
Current code extracts: data.accessToken, data.refreshToken, data.user  ← WRONG
Fix:
- Extract data.data.token → set ACCESS_TOKEN cookie
- Remove REFRESH_TOKEN cookie (no longer needed)
- Return { user: { id: data.data.account.id, email: data.data.account.email, name: data.data.account.name } }
```

**`handleLogout` — call backend to invalidate session:**
```
Currently: only clears cookies (session stays alive in DB)
Fix:
- Read ACCESS_TOKEN from cookies
- Call POST /auth/logout with Bearer token
- Delete ACCESS_TOKEN cookie (remove REFRESH_TOKEN reference)
```

**`handleMe` — fix endpoint:**
```
Currently calls: /auth/me  ← doesn't exist on backend
Fix: call GET /account/me
Backend returns: { data: { id, name, email }, message }
```

**Add `handleRegister`:**
```
POST /auth/register → backend POST /auth/register
Body: { name, email, password, confirmPassword }
Same session setup as handleLogin (set ACCESS_TOKEN cookie)
Return: { user }
```

**Add `handleSlideSession`:**
```
POST /auth/slide-session → backend POST /auth/slide-session
Requires: ACCESS_TOKEN in cookie
Updates ACCESS_TOKEN cookie with new token from backend
Return: { success: true }
```

### Route exports
```ts
GET:  me
POST: login, logout, register, slide-session
```

## Todo
- [ ] Fix `handleLogin` field extraction
- [ ] Fix `handleLogout` to call backend + remove REFRESH_TOKEN ref
- [ ] Fix `handleMe` to call `/account/me`
- [ ] Add `handleRegister`
- [ ] Add `handleSlideSession`
- [ ] Update POST switch + add GET for `slide-session` if needed
- [ ] Remove all `REFRESH_TOKEN` / `REFRESH_COOKIE_OPTIONS` imports

## Security Considerations
- Keep cookies HttpOnly, SameSite=Lax
- Never expose token to client JS
