# Phase 03 — Fix Server & Net Clients

**Status**: 🔴 Todo | **Priority**: High
**Depends on**: Phase 01 (types), Phase 02 (BFF routes)

## Overview

`lib/api/server.ts` calls non-existent `/auth/refresh`. `lib/net/net.ts` calls non-existent `/api/auth/refresh`. Both need to switch to `/auth/slide-session` (backend) and `/api/auth/slide-session` (BFF) respectively. Single token now — no more REFRESH_TOKEN.

## Files to Modify

### `client/src/lib/api/server.ts`

**Problem**: calls `/auth/refresh` endpoint which doesn't exist.
**Fix**: call `POST /auth/slide-session` with current token as Bearer.

```
Old: POST /auth/refresh + body: { refreshToken }
New: POST /auth/slide-session + header: Authorization: Bearer <current-token>
Old response: { accessToken, refreshToken }
New response: { data: { token, expiresAt, account }, message }
```

Updated logic:
1. Read `ACCESS_TOKEN` from cookies
2. Check if expired via `isTokenExpired(token)`
3. If expired → call `POST ${env.API_URL}/auth/slide-session` with Bearer token
4. On success → update `ACCESS_TOKEN` cookie with `data.data.token`
5. Remove all `REFRESH_TOKEN` / `REFRESH_COOKIE_OPTIONS` references

### `client/src/lib/net/net.ts`

**Problem**: `getOrStartRefresh()` calls `/api/auth/refresh` BFF (doesn't exist) and has broken retry logic.
**Fix**: Simplify — on 401 in browser, just redirect to login (or call `/api/auth/slide-session`).

Since `slide-session` requires a valid (not-expired) token — a 401 from the backend means the session IS expired/invalid, so sliding won't help. Clean solution: on 401, redirect to login.

Remove `getOrStartRefresh()` entirely. On 401 (browser, not retry):
```ts
if (!AUTH_BYPASS) window.location.href = '/login'
throw new ApiError(401, 'Session expired', ...)
```

This simplifies net.ts from ~100 lines to ~60 lines.

## Todo
- [ ] Fix `server.ts`: switch `/auth/refresh` → `/auth/slide-session`, single token
- [ ] Fix `server.ts`: remove REFRESH_TOKEN references
- [ ] Fix `net.ts`: remove `getOrStartRefresh()`, simplify 401 handler
- [ ] Run `tsc --noEmit` to confirm no type errors
