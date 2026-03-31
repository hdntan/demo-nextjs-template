# Phase 04 — Fix Proxy Route

**Status**: 🔴 Todo | **Priority**: Medium
**Depends on**: nothing (independent)

## Overview

Two bugs in `src/app/api/proxy/[...path]/route.ts`:
1. Requires auth for ALL requests — blocks public `GET /products` for unauthenticated users
2. Uses `request.text()` for body forwarding — breaks binary multipart uploads

## Files to Modify

### `client/src/app/api/proxy/[...path]/route.ts`

**Fix 1: Optional auth for GET requests**
```
Current: immediately return 401 if no token
Fix: only require token for non-GET methods; for GET, attach token if available (for auth-aware endpoints), pass through without it otherwise
```

```ts
// Before
if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

// After
const headers: Record<string, string> = {}
if (token) headers['Authorization'] = `Bearer ${token}`
// Continue without blocking if no token (backend will return 401 for protected endpoints)
```

**Fix 2: Binary body forwarding**
```
Current: const text = await request.text(); if (text) init.body = text
Problem: corrupts binary data (multipart/form-data)
Fix: use request.body stream directly
```

```ts
// Before
const text = await request.text()
if (text) init.body = text

// After
if (request.body) init.body = request.body
// Also add: duplex: 'half' for streaming in Node 18+
```

Note: when using `request.body` as stream, also need to set `duplex: 'half'` in init for Node.js compatibility.

## Todo
- [ ] Make token optional for GET, attach if available
- [ ] Switch from `request.text()` to `request.body` for body forwarding
- [ ] Add `duplex: 'half'` to fetch init for streaming support

## Impact
- Public product listing works without login
- File uploads via proxy work correctly
