# Phase 01 — Fix Core Types

**Status**: 🔴 Todo | **Priority**: High
**Depends on**: nothing
**Blocks**: Phase 02, 05

## Overview

Fix type mismatches between backend Zod schemas and frontend TypeScript types. Backend uses `id: number`, camelCase dates, single session token.

## Backend Contracts (source of truth)

**Account** (`AccountRes`):
```ts
{ id: number, name: string, email: string }
```

**Session/Auth response** (`LoginRes` / `RegisterRes`):
```ts
{ data: { token: string, expiresAt: string, account: { id, name, email } }, message: string }
```

**Product** (`ProductSchema`):
```ts
{ id: number, name: string, price: number, description: string, image: string, createdAt: string, updatedAt: string }
```

## Files to Modify

### `client/src/types/auth.ts`
```ts
export interface User {
  id: number       // was: string
  email: string
  name: string     // was: optional
}
```

### `client/src/lib/auth/constants.ts`
Remove `REFRESH_TOKEN` and `REFRESH_COOKIE_OPTIONS` exports — backend uses single sliding session token, no separate refresh token.

## Files to Create

### `client/src/types/product.ts`
```ts
export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  createdAt: string
  updatedAt: string
}

export interface CreateProductBody {
  name: string
  price: number
  description: string
  image: string
}

export type UpdateProductBody = CreateProductBody
```

## Todo
- [ ] Update `User.id` to `number`, `name` to required in `auth.ts`
- [ ] Remove `REFRESH_TOKEN` / `REFRESH_COOKIE_OPTIONS` from `auth/constants.ts`
- [ ] Create `src/types/product.ts`

## Risk
- Changing `User.id` from `string` → `number` may break components that do `user.id.toString()` — grep for usages after change.
